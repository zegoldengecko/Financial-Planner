import React from "react";
import { TransactionRankCard, BarGraphCard } from "./UICards";
import { CARD_GAP } from "../../utils/constants.js";

// ---------------------- VIEW OF TRENDS ----------------------
const TrendsView = ({ changingExpenses, changingIncome, categoryGrowth }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: CARD_GAP, height: "100%" }}>
      <div style={{ display: "flex", gap: CARD_GAP }}>
        <TransactionRankCard title="Fastest Growing Expenses" items={changingExpenses} addPlus="+" />
        <TransactionRankCard title="Fastest Growing Income" items={changingIncome} addPlus="+" />
      </div>

      <div style={{ display: "flex", gap: CARD_GAP, flex: 1 }}>
        <BarGraphCard title="Category Growth (Income)" data={categoryGrowth.filter(item => item.type === "income").map(item => ({ category: item.category, amount: item.growth }))} dataKeyX="category" bars={[{ dataKey: "amount" }]} reverseColours={false} />
      </div>

      <div style={{ display: "flex", gap: CARD_GAP, flex: 1 }}>
        <BarGraphCard title="Category Growth (Expenses)" data={categoryGrowth.filter(item => item.type === "expense").map(item => ({ category: item.category, amount: item.growth }))} dataKeyX="category" bars={[{ dataKey: "amount" }]} reverseColours={true} />
      </div>
    </div>
  );
};

export default TrendsView;
