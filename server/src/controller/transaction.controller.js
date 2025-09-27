import Transaction from "../model/transaction.model.js";
import mongoose from "mongoose";

// List with filters & pagination
export const list = async (req, res) => {
  // query params: page, limit, type, category, from, to, sort
  const { page = 1, limit = 10, type, category, from, to, sort = "-date" } = req.query;
  const q = {};

  if (type === "income" || type === "expense") q.type = type;
  if (category) q.category = category;

  if (from || to) {
    q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lte = new Date(to);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Transaction.find(q).sort(sort).skip(skip).limit(Number(limit)),
    Transaction.countDocuments(q)
  ]);

  res.json({
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit))
  });
};

// Create
export const create = async (req, res) => {
  try {
    const { amount, type, category, note, date } = req.body;
    const tx = await Transaction.create({ amount, type, category, note, date });
    res.status(201).json(tx);
    console.log(">>> Content-Type:", req.headers["content-type"]);
    console.log(">>> Body:", req.body);

} catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update
export const update = async (req, res) => {
  const tx = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(tx);
};

// Delete
export const remove = async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.status(204).end();
};

// Stats: total income/expense, by category, monthly series
export const stats = async (req, res) => {
  // params: from, to, groupBy = month/day
  const { from, to, groupBy = "month" } = req.query;
  const match = {};
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = new Date(from);
    if (to) match.date.$lte = new Date(to);
  }

  // total income & expense
  const totals = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: "$type", total: { $sum: "$amount" } } }
  ]);

  // by category
  const byCategory = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: { type: "$type", category: "$category" }, total: { $sum: "$amount" } } },
    { $sort: { total: -1 } }
  ]);

  // monthly/day series for chart
  const dateFormat = groupBy === "day" ? "%Y-%m-%d" : "%Y-%m";
  const series = await Transaction.aggregate([
    { $match: match },
    { $group: {
        _id: { $dateToString: { format: dateFormat, date: "$date" } },
        income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
        expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
    }},
    { $sort: { _id: 1 } }
  ]);

  res.json({ totals, byCategory, series });
};
    