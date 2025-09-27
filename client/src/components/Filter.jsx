export default function Filter({ filter, setFilter, onApply }) {
    const update = (field, value) => {
      setFilter(prev => ({ ...prev, [field]: value }));
    };
  
    return (
      <div className="flex flex-wrap gap-2 items-end mb-4">
        <select value={filter.type} onChange={e => update("type", e.target.value)} className="border p-2 rounded">
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
  
        <input type="text" placeholder="Category" value={filter.category}
          onChange={e => update("category", e.target.value)}
          className="border p-2 rounded"
        />
  
        <input type="date" value={filter.from}
          onChange={e => update("from", e.target.value)}
          className="border p-2 rounded"
        />
        <input type="date" value={filter.to}
          onChange={e => update("to", e.target.value)}
          className="border p-2 rounded"
        />
  
        <select value={filter.sort} onChange={e => update("sort", e.target.value)} className="border p-2 rounded">
          <option value="-date">Newest first</option>
          <option value="date">Oldest first</option>
        </select>
  
        <button onClick={onApply} className="bg-blue-500 text-white px-4 py-2 rounded">Apply</button>
      </div>
    );
  }
  