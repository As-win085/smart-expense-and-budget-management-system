import './index.css'

import { useEffect, useState } from "react";
import api from "../api/axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const fetchCategories = async () => {
    const res = await api.get("categories/");
    setCategories(res.data.results || []);
  };

  const addCategory = async () => {
    if (!name) return;
    await api.post("categories/", { name });
    setName("");
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          className="border p-2 mr-2 rounded"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={addCategory}
        >
          Add
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <ul>
           {Array.isArray(categories) && categories.map((cat) => (
                <li key={cat.id} className="border-b py-2">
                    {cat.name}
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Categories;
