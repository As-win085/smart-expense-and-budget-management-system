// src/context/TransactionsContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const fetchTransactions = async () => {
    const [incomeRes, expenseRes] = await Promise.all([
      api.get("income/"),
      api.get("expense/"),
    ]);
    setIncomes(incomeRes.data.results || incomeRes.data);
    setExpenses(expenseRes.data.results || expenseRes.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <TransactionsContext.Provider
      value={{ incomes, expenses, fetchTransactions }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionsContext);
