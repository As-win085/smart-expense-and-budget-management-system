import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as BarTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip as PieTooltip,
  Cell,
} from "recharts";



const COLORS = ["#4ade80", "#f87171", "#60a5fa", "#fbbf24", "#a78bfa"];

const Dashboard = () => {
  const navigate = useNavigate();

  // States
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [chartData, setChartData] = useState([]);
  const [expenseReport, setExpenseReport] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  

  // Fetch functions
  const fetchSummary = async () => {
    try {
      const res = await api.get(`reports/summary/?month=${month}&year=${year}`);
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChartData = async () => {
    try {
      const res = await api.get(`reports/income-expense/?month=${month}&year=${year}`);
      setChartData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExpenseReport = async () => {
    try {
      const res = await api.get(`reports/expense-by-category/?month=${month}&year=${year}`);
      setExpenseReport(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        api.get("income/"),
        api.get("expenses/"),
      ]);
      setIncomes(incomeRes.data.results || incomeRes.data);
      setExpenses(expenseRes.data.results || expenseRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Initial & filter fetch
  useEffect(() => {
    fetchSummary();
    fetchChartData();
    fetchExpenseReport();
    fetchTransactions();
  }, [month, year]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Month/Year Filter */}
      <div className="flex gap-2 mb-4">
        <select
          className="border p-2 rounded"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        >
          {[2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            fetchSummary();
            fetchChartData();
            fetchExpenseReport();
            fetchTransactions();
          }}
        >
          Apply
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-gray-600">Income</p>
          <p className="text-2xl font-bold text-green-600">₹{summary.income}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="text-gray-600">Expense</p>
          <p className="text-2xl font-bold text-red-600">₹{summary.expense}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-gray-600">Balance</p>
          <p className="text-2xl font-bold text-blue-600">₹{summary.balance}</p>
        </div>
      </div>

      {/* Income vs Expense Bar Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Income vs Expense</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <BarTooltip />
            <Bar dataKey="amount" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Expense by Category Pie Chart */}
      <div className="bg-white p-4 rounded shadow mt-6">
        <h2 className="text-lg font-semibold mb-4">Expense by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expenseReport}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {expenseReport.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <PieTooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <h2 className="text-lg font-semibold mt-6 mb-2">Recent Transactions</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Type</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {[
            ...incomes.map((i) => ({ ...i, type: "Income" })),
            ...expenses.map((e) => ({ ...e, type: "Expense" })),
          ]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10)
            .map((t) => (
              <tr key={`${t.type}-${t.id}`} className="hover:bg-gray-50">
                <td className="border p-2">{t.type}</td>
                <td className="border p-2">{t.category_name}</td>
                <td className="border p-2">₹{t.amount}</td>
                <td className="border p-2">{t.date}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
