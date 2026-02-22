const BASE_URL = "http://localhost:5000/api";

// ---------------------- FUNCTION TO SEND AN API REQUEST ----------------------
async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "API request failed");
    }

    return data;
}

// ---------------------- STAT ENDPOINTS ----------------------
// Fetching total income
export async function fetchTotalIncome(date) {
    const data = await apiRequest(`/stats/total-income?date=${date}`);
    return data.total;
}

// Fetching total expenses
export async function fetchTotalExpenses(date) {
    const data = await apiRequest(`/stats/total-expenses?date=${date}`);
    return data.total;
}

// Fetching total income from the previous period
export async function fetchPrevPeriodIncome(date) {
    const data = await apiRequest(`/stats/total-income?date=${date}`);
    return data.total;
}

// Fetch total expenses from the previous period
export async function fetchPrevPeriodExpenses(date) {
    const data = await apiRequest(`/stats/total-expenses?date=${date}`);
    return data.total;
}

// Fetching category income
export async function fetchCategoryIncome(date) {
  const data = await apiRequest(`/stats/category-income?date=${date}`);
  return data.incomeByCategory || [];
}

// Fetching category expenses
export async function fetchCategoryExpenses(date) {
  const data = await apiRequest(`/stats/category-expenses?date=${date}`);
  return data.expensesByCategory || [];
}

// Fetching spending type
export async function fetchSpendingType(date) {
  const data = await apiRequest(`/stats/spending-type?date=${date}`);
  return data.expensesBySpendingType || [];
}

// Fetching period transactions
export async function fetchPeriodTransactions(date) {
  const data = await apiRequest(`/stats/period-transactions?date=${date}`);
  return data.data || [];
}

// Fetching total savings
export async function fetchTotalSavings(date) {
  const data = await apiRequest(`/stats/total-savings?date=${date}`);
  return data.total;
}

// Fetching top 5 largest income sources
export async function fetchLargestIncome(date) {
  const data = await apiRequest(`/stats/largest-income?date=${date}`); 
  return data.topIncome || [];
}
// Fetching top 5 largest expenses
export async function fetchLargestExpense(date) {
  const data = await apiRequest(`/stats/largest-expense?date=${date}`);
  return data.topExpense || [];
}

// Fetching fastest growing income
export async function fetchFastestGrowingIncome(date, prevDate) {
  const data = await apiRequest(
    `/stats/fastest-growing-income?date=${date}&prevDate=${prevDate}`
  );
  return data.fastestGrowingIncomes || [];
}

// Fetching fastest growing expenses
export async function fetchFastestGrowingExpenses(date, prevDate) {
  const data = await apiRequest(
    `/stats/fastest-growing-expenses?date=${date}&prevDate=${prevDate}`
  );
  return data.fastestGrowingExpenses || [];
}

// Fetching category growth
export async function fetchCategoryGrowth(date, prevDate) {
  const data = await apiRequest(
    `/stats/category-growth?date=${date}&prevDate=${prevDate}`
  );
  return data.changeInCategories || [];
}
