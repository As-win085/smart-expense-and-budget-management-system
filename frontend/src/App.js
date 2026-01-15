import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/login";
import Dashboard from "./pages/dashboard";
import Layout from "./Components/Layout";
import Register from "./auth/Register";
import Income from "./pages/income";
import Expenses from "./pages/Expenses";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import ProtectedRoute from "./auth/ProtectedRoute";
import Categories from "./pages/Categories";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Layout><Dashboard /></Layout>
    </ProtectedRoute>
  } />

  <Route path="/income" element={
    <ProtectedRoute>
      <Layout><Income /></Layout>
    </ProtectedRoute>
  } />

  <Route path="/expenses" element={
    <ProtectedRoute>
      <Layout><Expenses /></Layout>
    </ProtectedRoute>
  } />

  <Route path="/budget" element={
    <ProtectedRoute>
      <Layout><Budget /></Layout>
    </ProtectedRoute>
  } />

  <Route path="/reports" element={
    <ProtectedRoute>
      <Layout><Reports /></Layout>
    </ProtectedRoute>
  } />
  <Route path="/categories" element={
    <ProtectedRoute>
      <Layout><Categories /></Layout>
    </ProtectedRoute>
} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
