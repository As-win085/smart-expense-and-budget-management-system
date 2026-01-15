import { useState, useEffect } from "react";
import api from "../api/axios";
import "./index.css";

const ExpenseForm = ({ editData, clearEdit, categories, onSuccess }) => {
  const [amount, setAmount] = useState(editData?.amount || "");
  const [category, setCategory] = useState(editData?.category || "");
  const [date, setDate] = useState(editData?.date || "");
  const [note, setNote] = useState(editData?.note || "");

  useEffect(() => {
    if (editData) {
      setAmount(editData.amount);
      setCategory(editData.category);
      setDate(editData.date);
      setNote(editData.note);
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      amount: parseFloat(amount),
      category: parseInt(category),
      date,
      note,
    };

    try {
      if (editData) {
        await api.patch(`expenses/${editData.id}/`, payload);
        clearEdit(); // reset form after editing
      } else {
        await api.post("expenses/", payload);
      }
      if (onSuccess) onSuccess(); // refresh list
      setAmount("");
      setCategory("");
      setDate("");
      setNote("");
      alert(editData ? "Expense updated!" : "Expense added!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit expense");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white">
      <h2 className="text-lg font-bold">{editData ? "Edit Expense" : "Add Expense"}</h2>
      <div>
        <label className="block">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label className="block">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="border p-2 w-full rounded"
        >
          <option value="">Select Category</option>
          {Array.isArray(categories) &&
            categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label className="block">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label className="block">Note</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {editData ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
};

export default ExpenseForm;

