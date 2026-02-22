import React from "react";
import { StatCard, GraphCard, ForecastCard } from "./UICards";
import { CARD_GAP, EXPENSE_COLOUR, INCOME_COLOUR, STANDARD_EI_RATIO, MIN_RUNWAY_MONTHS, CASHFLOW_COLOUR } from "../../utils/constants.js";

// ---------------------- VIEW OF GENERAL STATS ----------------------
const GeneralView = ({ totalIncome, totalExpenses, totalSavings, periodTransactions, savingsRate, EIRatio, emergencyFund, runway }) => {
  const periodCashflow = periodTransactions.map(item => ({
    period: item.period,
    net: item.income - item.expense
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: CARD_GAP, height: "100%" }}>
      {/* Stats */}
      <div style={{ display: "flex", gap: CARD_GAP }}>
        <StatCard title="Total Savings" value={`$${totalSavings.toLocaleString()}`} colour={totalSavings >= 0 ? "green" : "red"} />
        <StatCard title="Total Income" value={`$${totalIncome.toLocaleString()}`} colour="green" />
        <StatCard title="Total Expenses" value={`-$${totalExpenses.toLocaleString()}`} colour="red" />
        <StatCard title="Net Cashflow" value={`$${(totalIncome - totalExpenses).toLocaleString()}`} colour={totalIncome - totalExpenses >= 0 ? "green" : "red"} />
      </div>

      {/* Graphs */}
      <div style={{ display: "flex", gap: CARD_GAP, flex: 1 }}>
        <GraphCard title="Income vs Expenses" data={periodTransactions} lines={[{ dataKey: "income", color: INCOME_COLOUR }, { dataKey: "expense", color: EXPENSE_COLOUR }]} dataKeyX="period" />
        <GraphCard title="Net Cashflow" data={periodCashflow} lines={[{ dataKey: "net", color: CASHFLOW_COLOUR }]} dataKeyX="period" />
      </div>

      {/* Other stats */}
      <div style={{ display: "flex", gap: CARD_GAP }}>
        <StatCard title="Savings Rate" value={`${savingsRate}%`} colour={savingsRate >= 0 ? "green" : "red"} />
        <StatCard title="Expense / Income Ratio" value={`${EIRatio} : 1`} colour={EIRatio <= STANDARD_EI_RATIO ? "green" : "red"} />
        <StatCard title="Emergency Fund Estimate" value={`$${emergencyFund.toLocaleString()}`} colour={emergencyFund <= totalSavings ? "green" : "red"} />
        <StatCard title="Months of Runway" value={`${runway} months`} colour={runway >= MIN_RUNWAY_MONTHS ? "green" : "red"} />
      </div>

      <ForecastCard title="Next Period Forecast" />
    </div>
  );
};

export default GeneralView;
