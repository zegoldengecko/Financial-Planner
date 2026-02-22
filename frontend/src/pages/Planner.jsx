import React, { useState, useEffect } from "react";
import usePlannerData from "../hooks/usePlannerData";
import { useNavigate } from "react-router-dom";

// ---------------------- MAIN PAGE FOR STATS AND TRANSACTION ENTRY ----------------------

// ---------------------- HELPER FUNCTIONS ----------------------
import { formatCurrentDate, formatPreviousDate } from "../utils/dateHelpers.js";
import { calculateStats, addTransaction } from "../utils/plannerHelpers.js";

// ---------------------- TRANSACTION FORM ----------------------
import TransactionForm from "../components/planner/TransactionForm.jsx";

// ---------------------- CONSTANTS ----------------------
import {
  categories,
  STARTING_YEAR,
  STARTING_MONTH,
  STARTING_DATE_RANGE,
  STARTING_VIEW,
  TOP_RIBBON_PADDING,
  TOP_RIBBON_Z_INDEX,
  TOP_RIBBON_LETTER_SPACING,
  TOP_RIBBON_SPACER_HEIGHT,
  LEFT_PANEL_WIDTH,
  LEFT_PANEL_PADDING,
  MAIN_CONTENT_PADDING
} from "../utils/constants.js";

// ---------------------- STAT VIEWS ----------------------
import GeneralView from "../components/planner/GeneralView";
import IncomeView from "../components/planner/IncomeView";
import ExpenseView from "../components/planner/ExpenseView";
import TrendsView from "../components/planner/TrendsView";

// ---------------------- SHARED COMPONENT ----------------------
import ViewSelector from "../components/planner/ViewSelector";

function Planner() {
  const navigate = useNavigate();

  // States
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [typeOption, setTypeOption] = useState("");
  const [categoryOption, setCategoryOption] = useState("");
  const [amountValue, setAmountValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");

  // View Date Range
  const [yearValue, setYearValue] = useState(STARTING_YEAR);
  const [prevYearValue, setPrevYearValue] = useState(STARTING_YEAR);
  const [monthValue, setMonthValue] = useState(STARTING_MONTH);
  const [dateRangeOption, setDateRangeOption] = useState(STARTING_DATE_RANGE);

  // Dates
  const [formattedDate, setFormattedDate] = useState(formatCurrentDate(yearValue, monthValue, dateRangeOption));
  const [oldDate, setOldDate] = useState(formatPreviousDate(yearValue, monthValue, dateRangeOption));

  // State View
  const [currentView, setCurrentView] = useState(STARTING_VIEW);

  // Formatting the date
  const updateDateView = () => {
    setFormattedDate(formatCurrentDate(yearValue, monthValue, dateRangeOption));
    setOldDate(formatPreviousDate(yearValue, monthValue, dateRangeOption));
  };

  // One time fetch
  useEffect(() => {
    updateDateView();
  }, [yearValue, monthValue, dateRangeOption, success])

  // Defining variables for use
  console.log(formattedDate, oldDate, success);
  const {
    totalIncome,
    totalExpenses,
    prevIncome,
    prevExpenses,
    totalSavings,
    categoryIncome,
    categoryExpenses,
    spendingType: categorySpendingType,
    transactions: periodTransactions,
    largestIncome,
    largestExpense,
    fastestGrowingIncome: changingIncome,
    fastestGrowingExpenses: changingExpenses,
    categoryGrowth,
  } = usePlannerData(formattedDate, oldDate, success);

  // Calculating stats
  const stats = calculateStats({ totalIncome, totalExpenses, prevIncome, prevExpenses, totalSavings, periodTransactions });
  const { emergencyFund, incomeChange, incomeChangePercent, expenseChange, expenseChangePercent, periodCashflow, periodIncome, periodExpenses, savingsRate, EIRatio, runway } = stats;

  // Updating the view 
  const handleViewChange = (view) => setCurrentView(view);

  // Adding a transaction
  const handleTransactionAdd = async () => {
    const result = await addTransaction({ typeOption, categoryOption, amountValue, dateValue, descriptionValue, setError, setSuccess, updateDateView });
    if (result?.reset) {
      setTypeOption("");
      setCategoryOption("");
      setAmountValue("");
      setDateValue("");
      setDescriptionValue("");
      updateDateView();
    }
  };

  // Going to the transactions page
  const handleTransactionEdit = async () => {
    navigate("/transactions")
  }

  // Rendering the selected view
  const renderView = () => {
    switch (currentView) {
      case "Income":
        return <IncomeView
          totalIncome={totalIncome}
          incomeChange={incomeChange}
          incomeChangePercent={incomeChangePercent}
          largestIncome={largestIncome}
          periodIncome={periodIncome}
          categoryIncome={categoryIncome}
        />;
      case "Expense":
        return <ExpenseView
          totalExpenses={totalExpenses}
          expenseChange={expenseChange}
          expenseChangePercent={expenseChangePercent}
          largestExpense={largestExpense}
          periodExpenses={periodExpenses}
          categoryExpenses={categoryExpenses}
          categorySpendingType={categorySpendingType}
        />;
      case "Trends":
        return <TrendsView
          changingIncome={changingIncome}
          changingExpenses={changingExpenses}
          categoryGrowth={categoryGrowth}
        />;
      default: // General
        return <GeneralView
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          totalSavings={totalSavings}
          periodTransactions={periodTransactions}
          savingsRate={savingsRate}
          EIRatio={EIRatio}
          emergencyFund={emergencyFund}
          runway={runway}
        />;
    }
  };

  // HTML frontend code
  return (
    <div>
      <style>{`body { margin: 0; padding: 0; }`}</style>

      {/* Top Ribbon */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#bb4c0b",
          color: "white",
          padding: `${TOP_RIBBON_PADDING}px`,
          textAlign: "center",
          zIndex: TOP_RIBBON_Z_INDEX,
        }}
      >
        <h1 style={{ margin: 0, letterSpacing: `${TOP_RIBBON_LETTER_SPACING}px` }}>FINANCIAL PLANNER</h1>
      </div>

      {/* Spacer */}
      <div style={{ height: `${TOP_RIBBON_SPACER_HEIGHT}px` }} />

      <div
        style={{
          display: "flex",
          minHeight: `calc(100vh - ${TOP_RIBBON_SPACER_HEIGHT}px)`,
          backgroundColor: "#dbeeff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Left Panel */}
        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#003366", width: `${LEFT_PANEL_WIDTH}px` }}>
          <TransactionForm
            typeOption={typeOption}
            setTypeOption={setTypeOption}
            categoryOption={categoryOption}
            setCategoryOption={setCategoryOption}
            amountValue={amountValue}
            setAmountValue={setAmountValue}
            dateValue={dateValue}
            setDateValue={setDateValue}
            descriptionValue={descriptionValue}
            setDescriptionValue={setDescriptionValue}
            handleTransactionAdd={handleTransactionAdd}
            handleTransactionEdit={handleTransactionEdit}
            error={error}
            setError={setError}
            success={success}
            setSuccess={setSuccess}
            categories={categories}
            dateRangeOption={dateRangeOption}
            setDateRangeOption={setDateRangeOption}
            monthValue={monthValue}
            setMonthValue={setMonthValue}
            yearValue={yearValue}
            setYearValue={setYearValue}
            prevYearValue={prevYearValue}
            setPrevYearValue={setPrevYearValue}
            updateDateView={updateDateView}
          />

          <div style={{ padding: LEFT_PANEL_PADDING }}>
            <ViewSelector currentView={currentView} handleViewChange={handleViewChange} />
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: `${MAIN_CONTENT_PADDING}px`, backgroundColor: "#ffffff" }}>
          {renderView()}
        </div>
      </div>
    </div>
  );
}

export default Planner