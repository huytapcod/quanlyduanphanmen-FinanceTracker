import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },        // số tiền (positive)
  type: { type: String, enum: ["income", "expense"], required: true }, // loại
  category: { type: String, trim: true },          // ví dụ: Food, Salary, Rent
  note: { type: String, trim: true },
  date: { type: Date, required: true, index: true } // ngày giao dịch
}, { timestamps: true });

TransactionSchema.index({ date: -1 }); // nhanh filter theo ngày

export default mongoose.model("Transaction", TransactionSchema);
