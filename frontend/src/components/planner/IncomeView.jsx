import React from "react";
import { StatCard, TransactionRankCard, GraphCard, PieGraphCard, ForecastCard } from "./UICards";
import { CARD_GAP, INCOME_COLOUR } from "../../utils/constants.js";

// ---------------------- VIEW OF INCOME ----------------------
const IncomeView = ({ totalIncome, incomeChange, incomeChangePercent, largestIncome, periodIncome, categoryIncome }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: CARD_GAP, height: "100%" }}>
      <div style={{ display: "flex", gap: CARD_GAP }}>
        <StatCard title="Total Income" value={`$${totalIncome.toLocaleString()}`} colour="green" />
        <StatCard title="Change in Income" value={`$${incomeChange.toLocaleString()} (${incomeChangePercent.toLocaleString()}%)`} colour={incomeChange >= 0 ? "green" : "red"} />
        <TransactionRankCard title="Largest Income Transactions" items={largestIncome} addPlus="" />
      </div>

      <div style={{ display: "flex", gap: CARD_GAP, flex: 1 }}>
        <GraphCard title="Income Over Time" data={periodIncome} lines={[{ dataKey: "income", color: INCOME_COLOUR }]} dataKeyX="period" />
        <PieGraphCard title="Income By Category" data={categoryIncome} />
      </div>

      <ForecastCard title="Next Period Forecast" />
    </div>
  );
};

export default IncomeView;
