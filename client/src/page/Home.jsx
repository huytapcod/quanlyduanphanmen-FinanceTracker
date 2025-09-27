import React, { useEffect, useState } from "react";
import api from "../services/api";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 5; // số giao dịch mỗi trang

  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    note: "",
    date: "",
  });

  // chọn / bỏ chọn
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // xóa nhiều
  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa các giao dịch đã chọn?")) return;
    try {
      await Promise.all(selectedIds.map((id) => api.delete(`/transactions/${id}`)));
      setSelectedIds([]);

      // Sau khi xoá → nếu xoá hết ở trang hiện tại thì lùi lại 1 trang
      const newPage = Math.max(1, page - (transactions.length === selectedIds.length ? 1 : 0));
      setPage(newPage);
      fetchTransactions(newPage);
    } catch (err) {
      console.error("Error deleting transactions:", err);
    }
  };

  // tính category suggestions
  useEffect(() => {
    const cats = [...new Set(transactions.map((t) => t.category).filter(Boolean))];
    setCategorySuggestions(cats);
  }, [transactions]);

  // fetch giao dịch từ backend
  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/transactions", {
        params: { page, limit: itemsPerPage },
      });

      console.log("GET /transactions:", res.data);

      setTransactions(res.data.items || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // gọi khi đổi page
  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.date) return alert("Amount và Date là bắt buộc");
    try {
      await api.post("/transactions", { ...form, amount: Number(form.amount) });
      setForm({ amount: "", type: "expense", category: "", note: "", date: "" });
      // load lại trang 1
      setPage(1);
      fetchTransactions(1);
    } catch (err) {
      console.error("Error creating transaction:", err);
      alert("Tạo giao dịch thất bại, xem console để biết chi tiết");
    }
  };

  const fmtDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toISOString().slice(0, 10);
    } catch {
      return String(d).slice(0, 10);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Finance Tracker</h1>

      <form onSubmit={handleSubmit} className="space-y-3 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Số tiền"
            className="border rounded p-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            required
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded p-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="expense">Chi tiêu</option>
            <option value="income">Thu nhập</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Danh mục"
            className="border rounded p-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            list="categories"
          />
          <datalist id="categories">
            {categorySuggestions.map((c, i) => (
              <option key={i} value={c} />
            ))}
          </datalist>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border rounded p-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Ghi chú"
          className="border rounded p-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          rows={2}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Thêm giao dịch
        </button>
      </form>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Danh sách giao dịch</h2>
          <button
            onClick={deleteSelected}
            disabled={selectedIds.length === 0}
            className={`px-3 py-1 rounded ${
              selectedIds.length === 0
                ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            Xóa đã chọn
          </button>
        </div>
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">Chưa có giao dịch</div>
        ) : (
          <>
            <ul className="space-y-2">
              {transactions.map((tx) => (
                <li
                  key={tx._id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(tx._id)}
                    onChange={() => toggleSelect(tx._id)}
                  />
                  <span className="w-24 font-semibold">{tx.amount}</span>
                  <span className="w-32">{tx.category}</span>
                  <span className="w-24">{tx.type}</span>
                  <span className="w-32">{fmtDate(tx.date)}</span>
                  <span className="flex-1">{tx.note}</span>
                </li>
              ))}
            </ul>
            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                  />
                )}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
