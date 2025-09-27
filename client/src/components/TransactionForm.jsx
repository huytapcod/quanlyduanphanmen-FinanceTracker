import { useState } from "react";
import api from "../services/api";

export default function TransactionForm({ onCreate }) {
  const [form, setForm] = useState({ amount: "", type: "expense", category: "", date: new Date().toISOString().slice(0,10), note: "" });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/transactions", { ...form, amount: Number(form.amount) });
    setForm({ amount: "", type: "expense", category: "", date: new Date().toISOString().slice(0,10), note: "" });
    onCreate?.();
  };

  return (
    <form onSubmit={submit} className="grid gap-2 grid-cols-1 sm:grid-cols-3 items-end">
      <input required value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} placeholder="Amount" />
      <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input value={form.category} onChange={e=>setForm({...form, category:e.target.value})} placeholder="Category" />
      <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
      <input value={form.note} onChange={e=>setForm({...form, note:e.target.value})} placeholder="Note" />
      <button className="btn">Add</button>
    </form>
  );
}
