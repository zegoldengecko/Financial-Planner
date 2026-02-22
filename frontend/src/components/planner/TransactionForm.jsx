import React from "react";
import { 
  FORM_WIDTH, FORM_PADDING, BUTTON_GAP, RANGE_MARGIN_TOP, RANGE_MARGIN_BOTTOM,
  MONTH_WIDTH, YEAR_WIDTH, INPUT_PADDING, INPUT_FONT_SIZE, INPUT_BORDER_RADIUS, INPUT_MARGIN_BOTTOM,
  ACTION_BUTTON_PADDING, RANGE_BUTTON_PADDING, RANGE_BUTTON_FONT_SIZE,
  TEXTAREA_ROWS, MIN_YEAR, MAX_YEAR, PRIMARY_BG, SECONDARY_BG, TEXT_COLOR, TEXT_COLOR_BLACK,
  ERROR_COLOR, SUCCESS_COLOR, BORDER_COLOR, RANGE_ACTIVE_BG
} from "../../utils/constants.js";

// ---------------------- TRANSACTION ENTRY FORM ----------------------
const TransactionForm = ({
  typeOption, setTypeOption,
  categoryOption, setCategoryOption,
  amountValue, setAmountValue,
  dateValue, setDateValue,
  descriptionValue, setDescriptionValue,
  handleTransactionAdd,
  handleTransactionEdit,
  error, setError,
  success, setSuccess,
  categories,
  dateRangeOption, setDateRangeOption,
  monthValue, setMonthValue,
  yearValue, setYearValue,
  prevYearValue, setPrevYearValue,
  updateDateView
}) => {
  return (
    <div style={{
      width: FORM_WIDTH,
      backgroundColor: PRIMARY_BG,
      padding: FORM_PADDING,
      color: TEXT_COLOR,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <h2>ENTER A TRANSACTION</h2>

      {/* Transaction Type */}
      <select
        value={typeOption}
        onChange={(e) => {
          setTypeOption(e.target.value);
          setCategoryOption("");
        }}
        onFocus={() => { setError(""); setSuccess(""); }}
        style={styles.inputFull}
      >
        <option value="">Transaction Type</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
        <option value="savings">Savings</option>
      </select>

      {/* Category */}
      <select
        value={categoryOption}
        onChange={(e) => setCategoryOption(e.target.value)}
        disabled={!typeOption}
        onFocus={() => { setError(""); setSuccess(""); }}
        style={styles.inputFull}
      >
        <option value="">Category</option>
        {typeOption && categories[typeOption].map((cat, index) => (
          <option key={index} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Amount */}
      <input
        type="text"
        placeholder="Amount"
        value={amountValue}
        onChange={(e) => setAmountValue(e.target.value)}
        onFocus={() => { setError(""); setSuccess(""); }}
        style={styles.inputInset}
      />

      {/* Date */}
      <input
        type="text"
        placeholder="Date (DD/MM/YYYY)"
        value={dateValue}
        onChange={(e) => setDateValue(e.target.value)}
        onFocus={() => { setError(""); setSuccess(""); }}
        style={styles.inputInset}
      />

      {/* Description */}
      <textarea
        placeholder="Description (optional)"
        value={descriptionValue}
        onChange={(e) => setDescriptionValue(e.target.value)}
        onFocus={() => { setError(""); setSuccess(""); }}
        rows={TEXTAREA_ROWS}
        style={styles.textarea}
      />

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: BUTTON_GAP, width: "100%" }}>
        <button onClick={handleTransactionAdd} style={styles.actionButton}>Add</button>
        <button onClick={handleTransactionEdit} style={styles.actionButton}>Edit</button>
      </div>

      {/* Feedback Messages */}
      {error && <p style={styles.errorText}>{error}</p>}
      {success && <p style={styles.successText}>{success}</p>}

      {/* View Range Logic */}
      <div style={{ display: "flex", marginTop: RANGE_MARGIN_TOP, marginBottom: RANGE_MARGIN_BOTTOM, width: "100%" }}>
        {["monthly", "yearly", ""].map((range) => (
          <button
            key={range}
            onClick={() => setDateRangeOption(range)}
            style={{
              ...styles.rangeButton,
              backgroundColor: dateRangeOption === range ? RANGE_ACTIVE_BG : SECONDARY_BG,
            }}
          >
            {range === "monthly" ? "Monthly" : range === "yearly" ? "Yearly" : "Overall"}
          </button>
        ))}
      </div>

      {/* Date Selectors */}
      <div style={{ display: "flex", gap: "12px", width: "100%" }}>
        <select
          value={monthValue}
          onChange={(e) => setMonthValue(e.target.value)}
          disabled={dateRangeOption !== "monthly"}
          style={{ ...styles.inputFull, width: MONTH_WIDTH, marginBottom: 0 }}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const val = (i + 1).toString().padStart(2, "0");
            return (
              <option key={val} value={val}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            );
          })}
        </select>

        <input
          type="number"
          value={yearValue}
          min={MIN_YEAR}
          max={MAX_YEAR}
          onChange={(e) => setYearValue(e.target.value)}
          disabled={dateRangeOption === ""}
          onBlur={() => {
            const numericValue = Number(yearValue);
            if (numericValue < MIN_YEAR || numericValue > MAX_YEAR || isNaN(numericValue)) {
              setYearValue(prevYearValue);
            } else {
              setPrevYearValue(numericValue);
            }
            updateDateView();
          }}
          style={{ ...styles.inputFull, width: YEAR_WIDTH, marginBottom: 0 }}
        />
      </div>
    </div>
  );
};

// ---------------------- UI ELEMENTS ----------------------
const styles = {
  inputFull: { padding: INPUT_PADDING, fontSize: INPUT_FONT_SIZE, borderRadius: INPUT_BORDER_RADIUS, border: "none", width: "100%", marginBottom: INPUT_MARGIN_BOTTOM },
  inputInset: { padding: INPUT_PADDING, fontSize: INPUT_FONT_SIZE, borderRadius: INPUT_BORDER_RADIUS, border: "none", width: "94%", marginBottom: INPUT_MARGIN_BOTTOM },
  textarea: { padding: INPUT_PADDING, fontSize: INPUT_FONT_SIZE, borderRadius: INPUT_BORDER_RADIUS, border: "none", width: "94%", marginBottom: INPUT_MARGIN_BOTTOM, resize: "vertical" },
  actionButton: { padding: ACTION_BUTTON_PADDING, backgroundColor: SECONDARY_BG, color: TEXT_COLOR_BLACK, borderRadius: INPUT_BORDER_RADIUS, fontSize: INPUT_FONT_SIZE, cursor: "pointer", flex: 1 },
  rangeButton: { padding: RANGE_BUTTON_PADDING, color: TEXT_COLOR_BLACK, fontSize: RANGE_BUTTON_FONT_SIZE, cursor: "pointer", flex: 1, border: `1px solid ${BORDER_COLOR}` },
  errorText: { color: ERROR_COLOR, marginTop: "10px", fontWeight: "bold" },
  successText: { color: SUCCESS_COLOR, marginTop: "10px", fontWeight: "bold" }
};

export default TransactionForm;