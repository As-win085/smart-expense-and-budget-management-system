import { useState, useEffect } from "react";
import api from "../api/axios";

const BudgetForm = ({ editData, clearEdit, categories, onSuccess, month, year }) => {
  const [category, setCategory] = useState(editData?.category || "");
  const [monthlyLimit, setMonthlyLimit] = useState(editData?.monthly_limit || "");

  useEffect(() => {
    if (editData) {
      setCategory(editData.category);
      setMonthlyLimit(editData.monthly_limit);
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      category: parseInt(category),
      monthly_limit: parseFloat(monthlyLimit),
      month,
      year,
    };

    try {
      if (editData) {
        await api.patch(`/budgets-usage/${editData.id}/`, payload);
        clearEdit();
      } else {
        await api.post("/budgets-usage/", payload);
      }
      setCategory("");
      setMonthlyLimit("");
      if (onSuccess) onSuccess();
      alert(editData ? "Budget updated!" : "Budget added!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit budget");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white space-y-4">
      <h2 className="text-lg font-bold">{editData ? "Edit Budget" : "Add Budget"}</h2>
      <div>
        <label className="block">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="border p-2 w-full rounded"
        >
          <option value="">Select Category</option>
          {Array.isArray(categories) && categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block">Monthly Limit</label>
        <input
          type="number"
          value={monthlyLimit}
          onChange={(e) => setMonthlyLimit(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {editData ? "Update Budget" : "Add Budget"}
      </button>
    </form>
  );
};

export default BudgetForm;
