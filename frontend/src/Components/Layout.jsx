import { Link } from "react-router-dom";
import "./index.css";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow">
        <h2 className="text-xl font-bold p-4">Expense Tracker</h2>

        <nav className="flex flex-col gap-2 p-4">
          <Link className="hover:bg-gray-200 p-2 rounded" to="/dashboard">Dashboard</Link>
          <Link className="hover:bg-gray-200 p-2 rounded" to="/income">Income</Link>
          <Link className="hover:bg-gray-200 p-2 rounded" to="/expenses">Expenses</Link>
          <Link className="hover:bg-gray-200 p-2 rounded" to="/budget">Budget</Link>
          <Link className="hover:bg-gray-200 p-2 rounded" to="/reports">Reports</Link>
          <Link to="/categories" className="hover:bg-gray-200 p-2 rounded">Categories</Link>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

export default Layout;
