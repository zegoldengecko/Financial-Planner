import React from "react";
import { StatCard, TransactionRankCard, GraphCard, PieGraphCard, ForecastCard } from "./UICards";
import { CARD_GAP, EXPENSE_COLOUR } from "../../utils/constants.js";

// ---------------------- VIEW OF EXPENSES ----------------------
const ExpenseView = ({ totalExpenses, expenseChange, expenseChangePercent, largestExpense, periodExpenses, categoryExpenses, categorySpendingType }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: CARD_GAP, height: "100%" }}>
      <div style={{ display: "flex", gap: CARD_GAP }}>
        <StatCard title="Total Expenses" value={`$${totalExpenses.toLocaleString()}`} colour="red" />
        <StatCard title="Change in Expenses" value={`$${expenseChange.toLocaleString()} (${expenseChangePercent.toLocaleString()}%)`} colour={expenseChange <= 0 ? "green" : "red"} />
        <TransactionRankCard title="Largest Expense Transactions" items={largestExpense} addPlus="" />
      </div>

      <div style={{ display: "flex", gap: CARD_GAP, flex: 1 }}>
        <GraphCard title="Expenses Over Time" data={periodExpenses} lines={[{ dataKey: "expense", color: EXPENSE_COLOUR }]} dataKeyX="period" />
        <PieGraphCard title="Expenses By Category" data={categoryExpenses} />
        <PieGraphCard title="Expenses By Type" data={categorySpendingType} />
      </div>

      <ForecastCard title="Next Period Forecast" />
    </div>
  );
};

export default ExpenseView;

