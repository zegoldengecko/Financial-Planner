import { useEffect, useState } from "react";
import {
  fetchTotalIncome,
  fetchTotalExpenses,
  fetchPrevPeriodIncome,
  fetchPrevPeriodExpenses,
  fetchCategoryIncome,
  fetchCategoryExpenses,
  fetchSpendingType,
  fetchPeriodTransactions,
  fetchTotalSavings,
  fetchLargestIncome,
  fetchLargestExpense,
  fetchFastestGrowingIncome,
  fetchFastestGrowingExpenses,
  fetchCategoryGrowth,
} from "../services/plannerApi.js";

// Function to pull data from the database for use in frontend code whenver the date changes
export default function usePlannerData(date, prevDate, success) {
    const [data, setData] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        prevIncome: 0,
        prevExpenses: 0,
        totalSavings: 0,
        categoryIncome: [],
        categoryExpenses: [],
        spendingType: [],
        transactions: [],
        largestIncome: [],
        largestExpense: [],
        fastestGrowingIncome: [],
        fastestGrowingExpenses: [],
        categoryGrowth: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                // Pulling the data
                const [
                    totalIncome,
                    totalExpenses,
                    prevIncome,
                    prevExpenses,
                    totalSavings,
                    categoryIncome,
                    categoryExpenses,
                    spendingType,
                    transactions,
                    largestIncome,
                    largestExpense,
                    fastestGrowingIncome,
                    fastestGrowingExpenses,
                    categoryGrowth,
                ] = await Promise.all([
                    fetchTotalIncome(date),
                    fetchTotalExpenses(date),
                    fetchPrevPeriodIncome(prevDate),
                    fetchPrevPeriodExpenses(prevDate),
                    fetchTotalSavings(date),
                    fetchCategoryIncome(date),
                    fetchCategoryExpenses(date),
                    fetchSpendingType(date),
                    fetchPeriodTransactions(date),
                    fetchLargestIncome(date),
                    fetchLargestExpense(date),
                    fetchFastestGrowingIncome(date, prevDate),
                    fetchFastestGrowingExpenses(date, prevDate),
                    fetchCategoryGrowth(date, prevDate),
                ]);

                // Setting the data
                console.log("THE TOTAL INCOME IS", totalIncome);
                setData({
                    totalIncome,
                    totalExpenses,
                    prevIncome,
                    prevExpenses,
                    totalSavings,
                    categoryIncome,
                    categoryExpenses,
                    spendingType,
                    transactions,
                    largestIncome,
                    largestExpense,
                    fastestGrowingIncome,
                    fastestGrowingExpenses,
                    categoryGrowth,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [date, prevDate, success]);

    return { ...data, loading, error };
}
