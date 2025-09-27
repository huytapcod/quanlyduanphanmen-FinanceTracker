import api from "../services/api";

export default function TransactionList({ items, onDelete, onEdit }) {
  if (!items.length) {
    return <p className="text-gray-500">No transactions found.</p>;
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    await api.delete(`/transactions/${id}`);
    onDelete();
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Date</th>
          <th className="p-2 border">Category</th>
          <th className="p-2 border">Type</th>
          <th className="p-2 border">Amount</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((t) => (
          <tr key={t._id} className="hover:bg-gray-50">
            <td className="p-2 border">{new Date(t.date).toLocaleDateString()}</td>
            <td className="p-2 border">{t.category}</td>
            <td className={`p-2 border ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
              {t.type}
            </td>
            <td className="p-2 border font-semibold">${t.amount}</td>
            <td className="p-2 border flex gap-2">
              <button
                onClick={() => onEdit(t)}
                className="px-2 py-1 bg-yellow-400 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t._id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
