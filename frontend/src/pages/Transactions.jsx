import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionMain from "../components/transactions/TransactionMain";

// ---------------------- CONSTANTS ----------------------
import {
    categories,
    EXPENSE_COLOUR,
    INCOME_COLOUR,
    TRANSACTION_TYPE_EXPENSE,
    TRANSACTION_TYPE_SAVINGS,
    SORT_DIRECTION_ASC,
    spendingTypeMap
} from "../utils/constants.js";

// ---------------------- HELPERS ----------------------
import {
    sortTransactions
} from "../utils/transactionHelpers.js";

import {
    validateTransaction
} from "../utils/plannerHelpers.js";

// ---------------------- MAIN CODE ----------------------
function Transactions() {
    const navigate = useNavigate();

    // Sorting and general states
    const [transactions, setTransactions] = useState([]);
    const [typeSortDir, setTypeSortDir] = useState(SORT_DIRECTION_ASC);
    const [categorySortDir, setCategorySortDir] = useState(SORT_DIRECTION_ASC);
    const [spendingTypeSortDir, setSpendingTypeSortDir] = useState(SORT_DIRECTION_ASC);
    const [amountSortDir, setAmountSortDir] = useState(SORT_DIRECTION_ASC);
    const [dateSortDir, setDateSortDir] = useState(SORT_DIRECTION_ASC);
    const [error, setError] = useState("");

    // Editing states
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editForm, setEditForm] = useState({
        id: "",
        type: "",
        category: "",
        spendingType: "",
        amount: "",
        date: "",
        description: ""
    });
    const [editError, setEditError] = useState("");

    // Loads transactions when the page opens
    useEffect(() => {
        fetchTransactions();
    }, []);

    // Fetching transactions
   const fetchTransactions = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/transactions", { credentials: "include" });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to load transactions");
                return;
            }
            setTransactions(data);
        } catch (err) {
            console.error(err);
            setError("Error Fetching Transactions");
        }
    };

    // Deleting transaction
    const deleteTransaction = async (id) => {
        if (!window.confirm("Delete this transaction?")) return;

        await fetch(`http://localhost:5000/api/transactions/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        fetchTransactions(); 
    };

    // Returns to previous page
    const goBack = async () => {
        navigate("/Planner")
    }

    // Deciding sign and colour to display on amount
    const displayAmount = (t) => {
        let sign = "+";
        let color = INCOME_COLOUR;

        if (t.type === TRANSACTION_TYPE_EXPENSE) {
            sign = "-";
            color = EXPENSE_COLOUR;
        } else if (t.type === TRANSACTION_TYPE_SAVINGS && t.category === "Withdrawal") {
            sign = "-";
            color = EXPENSE_COLOUR;
        }

        return { value: `${sign}$${Number(t.amount).toFixed(2)}`, color };
    };

    // Handling Edits
    const handleEdit = (t) => {
        setEditingTransaction(t);
        setEditForm({
            id: t.id,
            type: t.type,
            category: t.category,
            spendingType: t.spendingType || "",
            amount: t.amount,
            date: t.date,
            description: t.description || ""
        });
        setEditError("");
    }

    // Saving Edits
    const saveEdit = async () => {
        // Validate fields using helper
        const errorMsg = validateTransaction({
            type: editForm.type,
            category: editForm.category,
            amount: editForm.amount,
            date: editForm.date
        });

        if (errorMsg) {
            setEditError(errorMsg);
            return;
        }

        const amount = parseFloat(editForm.amount.toString().replace(/[$,]/g, ""));

        // Assigning spending type
        let spending = "NULL";
        if (spendingTypeMap.discretionary.includes(editForm.category)) {
            spending = "Discretionary";
        } else if (spendingTypeMap.nonDiscretionary.includes(editForm.category)) {
            spending = "Non-Discretionary";
        }

        try {
            const res = await fetch(`http://localhost:5000/api/transactions/${editingTransaction.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    type: editForm.type,
                    category: editForm.category,
                    spendingType: spending,
                    amount,
                    date: editForm.date,
                    description: editForm.description
                })
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(editForm)
                setEditError(data.error || "Failed to update transaction");
                return;
            }
            fetchTransactions();
            setEditingTransaction(null);
        } catch (err) {
            console.error(err);
            setEditError("Error Saving Edit");
        }
    };

    // Sorting columns
    const sortByType = () => {
        const sorted = sortTransactions(transactions, t => t.type, typeSortDir, setTypeSortDir);
        setTransactions(sorted);
    };

    const sortByCategory = () => {
        const sorted = sortTransactions(transactions, t => t.category, categorySortDir, setCategorySortDir);
        setTransactions(sorted);
    };

    const sortBySpendingType = () => {
        const sorted = sortTransactions(
            transactions,
            t => {
                if (!t.spendingType || t.spendingType === "-") return "zzz";
                return t.spendingType.toLowerCase();
            },
            spendingTypeSortDir,
            setSpendingTypeSortDir
        );
        setTransactions(sorted);
    };

    const sortByAmount = () => {
        const sorted = sortTransactions(
            transactions,
            t => t.type === TRANSACTION_TYPE_EXPENSE ? -t.amount : t.amount,
            amountSortDir,
            setAmountSortDir
        );
        setTransactions(sorted);
    };

    const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split("/").map(Number);
        return new Date(year, month - 1, day);
    };

    const sortByDate = () => {
        const sorted = sortTransactions(
            transactions,
            t => parseDate(t.date),
            dateSortDir,
            setDateSortDir
        );
        setTransactions(sorted);
    };

    return (
          <TransactionMain
            transactions={transactions}
            error={error}
            goBack={goBack}
            deleteTransaction={deleteTransaction}
            handleEdit={handleEdit}
            displayAmount={displayAmount}

            editingTransaction={editingTransaction}
            editForm={editForm}
            setEditForm={setEditForm}
            saveEdit={saveEdit}
            editError={editError}
            setEditingTransaction={setEditingTransaction}

            categories={categories}

            sortByType={sortByType}
            sortByCategory={sortByCategory}
            sortBySpendingType={sortBySpendingType}
            sortByAmount={sortByAmount}
            sortByDate={sortByDate}
        />
  );
}

export default Transactions;
