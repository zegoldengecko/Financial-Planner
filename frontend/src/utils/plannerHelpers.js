import { 
  spendingTypeMap,
  MIN_TRANSACTION_AMOUNT,
  MAX_TRANSACTION_AMOUNT,
  MIN_YEAR,
  MAX_YEAR,
  SPENDING_TYPE_DISCRETIONARY,
  SPENDING_TYPE_NON_DISCRETIONARY,
  SPENDING_TYPE_NULL,
  EMERGENCY_FUND_MULTIPLIER,
  PERCENT_MULTIPLIER,
  DATE_REGEX
} from "./constants.js";

// Validating the new transaction
export const validateTransaction = ({ type, category, amount, date }) => {
  if (!type || !category || !amount || !date) return "Required fields are empty";

  const numericAmount = parseFloat(String(amount).replace(/[$,]/g, ""));
  if (isNaN(numericAmount) || numericAmount <= MIN_TRANSACTION_AMOUNT || numericAmount >= MAX_TRANSACTION_AMOUNT) {
    return `Invalid amount. Must be between $${MIN_TRANSACTION_AMOUNT} and $${MAX_TRANSACTION_AMOUNT.toLocaleString()}.`;
  }

  if (!DATE_REGEX.test(date)) return "Invalid date.";

  const year = parseInt(date.split("/")[2], 10);
  if (year < MIN_YEAR || year > MAX_YEAR) return `Year must be between ${MIN_YEAR} and ${MAX_YEAR}.`;

  return null;
};

// Getting the spending type
export const getSpendingType = (category) => {
  if (spendingTypeMap.discretionary.includes(category)) return SPENDING_TYPE_DISCRETIONARY;
  if (spendingTypeMap.nonDiscretionary.includes(category)) return SPENDING_TYPE_NON_DISCRETIONARY;
  return SPENDING_TYPE_NULL;
};

// Calculating financial statistics
export function calculateStats({ totalIncome, totalExpenses, prevIncome, prevExpenses, totalSavings, periodTransactions }) {
  const emergencyFund = totalExpenses * EMERGENCY_FUND_MULTIPLIER;

  const incomeChange = totalIncome - prevIncome;
  const incomeChangePercent = prevIncome !== 0 ? ((incomeChange / prevIncome) * PERCENT_MULTIPLIER).toFixed(0) : 0;

  const expenseChange = totalExpenses - prevExpenses;
  const expenseChangePercent = prevExpenses !== 0 ? ((expenseChange / prevExpenses) * PERCENT_MULTIPLIER).toFixed(0) : 0;

  const periodCashflow = periodTransactions.map(item => ({
    period: item.period,
    net: item.income - item.expense
  }));

  const periodIncome = periodTransactions.map(item => ({
    period: item.period,
    income: item.income
  }));

  const periodExpenses = periodTransactions.map(item => ({
    period: item.period,
    expense: item.expense
  }));

  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * PERCENT_MULTIPLIER).toFixed(2) : 0;
  const EIRatio = totalIncome > 0 ? (totalExpenses / totalIncome).toFixed(2) : 0;
  const runway = totalExpenses > 0 ? Math.floor(totalSavings / totalExpenses) : 0;

  return {
    emergencyFund,
    incomeChange,
    incomeChangePercent,
    expenseChange,
    expenseChangePercent,
    periodCashflow,
    periodIncome,
    periodExpenses,
    savingsRate,
    EIRatio,
    runway
  };
}

// Adding a transaction to a database
export async function addTransaction({ typeOption, categoryOption, amountValue, dateValue, descriptionValue, setError, setSuccess, updateDateView }) {
  setError("");
  setSuccess("");

  // Validate inputs
  const errorMsg = validateTransaction({ type: typeOption, category: categoryOption, amount: amountValue, date: dateValue });
  if (errorMsg) {
    setError(errorMsg);
    return;
  }

  const amount = parseFloat(amountValue.replace(/[$,]/g, ""));
  const spending = getSpendingType(categoryOption);

  try {
    const response = await fetch("http://localhost:5000/api/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ type: typeOption, category: categoryOption, spendingType: spending, amount, date: dateValue, description: descriptionValue }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Adding transaction failed");
      return;
    }

    setSuccess("Added Transaction!");
    return { reset: true, updateDateView };
  } catch (err) {
    console.error("Error adding transaction:", err);
    setError("Network error.");
  }
}