import React from "react";
import TransactionEdit from "./TransactionEdit";

// ---------------------- CONSTANTS ----------------------
import {
  PRIMARY_BG,
  SECONDARY_BG,
  TEXT_COLOR,
  ERROR_COLOR,
  SPENDING_TYPE_NULL,
  BUTTON_STYLE,
  DELETE_BUTTON_STYLE,
  CELL_STYLE,
  SORT_BUTTON_STYLE
} from "../../utils/constants.js";

// ---------------------- MAIN COMPONENT ----------------------
const TransactionMain = ({
  transactions,
  error,
  goBack,
  deleteTransaction,
  handleEdit,
  displayAmount,
  editingTransaction,
  editForm,
  setEditForm,
  saveEdit,
  setEditingTransaction,
  editError,
  categories,
  sortByType,
  sortByCategory,
  sortBySpendingType,
  sortByAmount,
  sortByDate
}) => {
  return (
    <div style={{
      backgroundColor: SECONDARY_BG,
      border: `5px solid ${PRIMARY_BG}`,
      minHeight: "100vh",
      padding: 40,
      fontFamily: "Arial"
    }}>
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          style={{ ...BUTTON_STYLE, padding: "12px 20px", fontSize: 23 }}
          onClick={goBack}
        >
          Back
        </button>

        <h1 style={{ flex: 1, textAlign: "center", color: PRIMARY_BG }}>
          TRANSACTIONS
        </h1>
      </div>

      {error && <p style={{ color: ERROR_COLOR, textAlign: "center" }}>{error}</p>}

      {/* Table */}
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: 30,
        textAlign: "center"
      }}>
        <thead>
          <tr style={{ backgroundColor: PRIMARY_BG, color: TEXT_COLOR }}>
            <th style={CELL_STYLE}>Type <button style={SORT_BUTTON_STYLE} onClick={sortByType}>⇅</button></th>
            <th style={CELL_STYLE}>Category <button style={SORT_BUTTON_STYLE} onClick={sortByCategory}>⇅</button></th>
            <th style={CELL_STYLE}>Spending Type <button style={SORT_BUTTON_STYLE} onClick={sortBySpendingType}>⇅</button></th>
            <th style={CELL_STYLE}>Amount <button style={SORT_BUTTON_STYLE} onClick={sortByAmount}>⇅</button></th>
            <th style={CELL_STYLE}>Date <button style={SORT_BUTTON_STYLE} onClick={sortByDate}>⇅</button></th>
            <th style={CELL_STYLE}>Description</th>
            <th style={CELL_STYLE}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length === 0 && (
            <tr>
              <td colSpan="7" style={{ padding: 20 }}>No transactions found</td>
            </tr>
          )}

          {transactions.map((t) => (
            <tr key={t.id}>
              <td style={CELL_STYLE}>{t.type}</td>
              <td style={CELL_STYLE}>{t.category}</td>
              <td style={CELL_STYLE}>
                {t.spendingType && t.spendingType !== SPENDING_TYPE_NULL ? t.spendingType : "-"}
              </td>
              <td style={{
                ...CELL_STYLE,
                color: displayAmount(t).color,
                fontWeight: "bold"
              }}>
                {displayAmount(t).value}
              </td>
              <td style={CELL_STYLE}>{t.date}</td>
              <td style={CELL_STYLE}>{t.description}</td>
              <td style={CELL_STYLE}>
                <button style={BUTTON_STYLE} onClick={() => handleEdit(t)}>Edit</button>
                <button style={DELETE_BUTTON_STYLE} onClick={() => deleteTransaction(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      <TransactionEdit
        editingTransaction={editingTransaction}
        editForm={editForm}
        setEditForm={setEditForm}
        editError={editError}
        onSave={saveEdit}
        onCancel={() => setEditingTransaction(null)}
        categories={categories}
      />
    </div>
  );
};

export default TransactionMain;