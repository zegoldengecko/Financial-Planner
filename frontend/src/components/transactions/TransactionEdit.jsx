import React from "react";
import { 
  INPUT_PADDING,
  INPUT_FONT_SIZE, 
  INPUT_BORDER_RADIUS, 
  INPUT_MARGIN_BOTTOM,
  TEXTAREA_ROWS, 
  BUTTON_STYLE, 
  DELETE_BUTTON_STYLE,
  ERROR_COLOR,
  MODAL_OVERLAY_STYLE,
  MODAL_CONTENT_STYLE
} from "../../utils/constants.js";

// ---------------------- FORM TO EDIT TRANSACTIONS ----------------------
function TransactionEdit({
    editingTransaction,
    editForm,
    setEditForm,
    editError,
    onSave,
    onCancel,
    categories
}) {

  if (!editingTransaction) return null;

  return (
    <div style={MODAL_OVERLAY_STYLE}>
        <div style={MODAL_CONTENT_STYLE}>
            <h2>Edit Transaction</h2>

            <label>Type:</label>
            <select
                value={editForm.type}
                onChange={(e) =>
                    setEditForm({ ...editForm, type: e.target.value })
                }
                style={{
                    padding: INPUT_PADDING,
                    fontSize: INPUT_FONT_SIZE,
                    borderRadius: INPUT_BORDER_RADIUS,
                    marginBottom: INPUT_MARGIN_BOTTOM
                }}
            >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="savings">Savings</option>
            </select>

            <label>Category:</label>
            <select
                value={editForm.category}
                onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                }
                style={{
                    padding: INPUT_PADDING,
                    fontSize: INPUT_FONT_SIZE,
                    borderRadius: INPUT_BORDER_RADIUS,
                    marginBottom: INPUT_MARGIN_BOTTOM
                }}
            >
                <option value="">--Select Category--</option>
                {editForm.type &&
                    categories[editForm.type].map((cat, index) => (
                        <option key={index} value={cat}>
                            {cat}
                        </option>
                    ))}
            </select>

            <label>Amount:</label>
            <input
                type="text"
                value={editForm.amount}
                onChange={(e) =>
                    setEditForm({ ...editForm, amount: e.target.value })
                }
                style={{
                    padding: INPUT_PADDING,
                    fontSize: INPUT_FONT_SIZE,
                    borderRadius: INPUT_BORDER_RADIUS,
                    marginBottom: INPUT_MARGIN_BOTTOM
                }}
            />

            <label>Date:</label>
            <input
                type="text"
                value={editForm.date}
                onChange={(e) =>
                    setEditForm({ ...editForm, date: e.target.value })
                }
                placeholder="DD/MM/YYYY"
                style={{
                    padding: INPUT_PADDING,
                    fontSize: INPUT_FONT_SIZE,
                    borderRadius: INPUT_BORDER_RADIUS,
                    marginBottom: INPUT_MARGIN_BOTTOM
                }}
            />

            <label>Description:</label>
            <textarea
                rows={TEXTAREA_ROWS}
                value={editForm.description}
                onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                }
                style={{
                    padding: INPUT_PADDING,
                    fontSize: INPUT_FONT_SIZE,
                    borderRadius: INPUT_BORDER_RADIUS,
                    marginBottom: INPUT_MARGIN_BOTTOM
                }}
            />

            {editError && <p style={{ color: ERROR_COLOR }}>{editError}</p>}

            <div style={{ marginTop: BUTTON_STYLE.margin }}>
                <button
                    style={{ ...BUTTON_STYLE, marginRight: BUTTON_STYLE.margin }}
                    onClick={onSave}
                >
                    Save
                </button>
                <button style={DELETE_BUTTON_STYLE} onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    </div>
  );
}

export default TransactionEdit;