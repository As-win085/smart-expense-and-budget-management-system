import { useState, useEffect } from "react";
import api from "../api/axios"; // make sure axios is configured with baseURL and auth
import IncomeForm from "../Components/ExpenseForm";
import "./index.css";

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [editData, setEditData] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const res = await api.get("expenses/");
      setExpenses(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await api.get("categories/");
      setCategories(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const handleEdit = (data) => setEditData(data);
  const clearEdit = () => setEditData(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await api.delete(`expenses/${id}/`);
      fetchExpenses();
      alert("Expense deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete expense");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <IncomeForm
        editData={editData}
        clearEdit={clearEdit}
        categories={categories}
        onSuccess={fetchExpenses}
      />

      <table className="w-full border mt-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Category</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Note</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((inc) => (
            <tr key={inc.id} className="hover:bg-gray-50">
              <td className="border p-2">{inc.category_name}</td>
              <td className="border p-2">₹{inc.amount}</td>
              <td className="border p-2">{inc.date}</td>
              <td className="border p-2">{inc.note}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                  onClick={() => handleEdit(inc)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(inc.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensePage;
