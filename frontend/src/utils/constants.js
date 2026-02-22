// ---------------------- CATEGORY AND SPENDING TYPE MAPPING ----------------------
export const categories = {
  income: ["Salary", "Interest", "Investments", "Bonuses", "Other Income"],
  expense: ["Rent", "Utilities", "Insurance", "Health/Medical", "Education", "Travel", "Subscriptions", "Loan payment", "Leisure", "Clothes", "Food", "Other Expense"],
  savings: ["Deposit", "Withdrawal"]
};

export const spendingTypeMap = {
  discretionary: ["Travel", "Leisure", "Clothes", "Other Expense"],
  nonDiscretionary: ["Rent", "Utilities", "Insurance", "Health/Medical", "Education", "Subscriptions", "Loan payment", "Savings", "Food"]
};

// ---------------------- MONTH NAMES ----------------------
export const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ---------------------- TRANSACTION VIEW ----------------------
export const CARD_GAP = 16;
export const EXPENSE_COLOUR = "#ef4444";
export const INCOME_COLOUR = "#22c55e";
export const CASHFLOW_COLOUR = "rgb(82, 116, 226)";

// ---------------------- STATS ----------------------
export const STANDARD_EI_RATIO = 0.8;
export const MIN_RUNWAY_MONTHS = 6;

// ---------------------- TRANSACTION FORM ----------------------
export const FORM_WIDTH = "300px";
export const FORM_PADDING = "20px";
export const BUTTON_GAP = "10px";
export const RANGE_MARGIN_TOP = "40px";
export const RANGE_MARGIN_BOTTOM = "10px";
export const MONTH_WIDTH = "54%";
export const YEAR_WIDTH = "46%";
export const INPUT_PADDING = "10px";
export const INPUT_FONT_SIZE = "16px";
export const INPUT_BORDER_RADIUS = "6px";
export const INPUT_MARGIN_BOTTOM = "20px";
export const ACTION_BUTTON_PADDING = "12px 24px";
export const RANGE_BUTTON_PADDING = "12px 10px";
export const RANGE_BUTTON_FONT_SIZE = "14px";
export const TEXTAREA_ROWS = 5;
export const MIN_YEAR = 1976;
export const MAX_YEAR = 2076;
export const PRIMARY_BG = "#003366";
export const SECONDARY_BG = "#dbeeff";
export const TEXT_COLOR = "white";
export const TEXT_COLOR_BLACK = "black";
export const ERROR_COLOR = "red";
export const SUCCESS_COLOR = "green";
export const BORDER_COLOR = "#ccc";
export const EXPENSE_COLOR = "#ef4444";
export const RANGE_ACTIVE_BG = "#5a8fcf";
export const TRANSACTION_TYPE_INCOME = "income"
export const TRANSACTION_TYPE_EXPENSE = "expense";
export const TRANSACTION_TYPE_SAVINGS = "savings";

// ---------------------- UICARD ----------------------
export const CARD_BORDER_RADIUS = 10;
export const CARD_BOX_SHADOW = "0 2px 4px rgba(0,0,0,0.08)";
export const CARD_BORDER_LEFT_WIDTH = 6;
export const CARD_VALUE_FONT_SIZE = 24;
export const TABLE_HEADER_FONT_SIZE = 12;
export const TABLE_ROW_FONT_SIZE = 13;
export const TABLE_ROW_PADDING = "4px 0";
export const PIE_OUTER_RADIUS = 90;
export const LINE_STROKE_WIDTH = 2;
export const REGRESSION_LINE_DASHARRAY = "5 5";
export const REGRESSION_LINE_OPACITY = 0.4;
export const CHART_GRID_DASHARRAY = "3 3";

// ---------------------- STAT VIEW ----------------------
export const STARTING_YEAR = "2026";
export const STARTING_MONTH = "01";
export const STARTING_DATE_RANGE = "monthly";
export const STARTING_VIEW = "General";

// ---------------------- COMPONENT STYLING ----------------------
export const TOP_RIBBON_PADDING = 18;
export const TOP_RIBBON_Z_INDEX = 1000;
export const TOP_RIBBON_LETTER_SPACING = 2;
export const TOP_RIBBON_SPACER_HEIGHT = 60;
export const LEFT_PANEL_WIDTH = 350;
export const LEFT_PANEL_PADDING = "0 20px 20px 20px";
export const MAIN_CONTENT_PADDING = 20;

// ---------------------- DATEHELPER ----------------------
export const MONTHLY_RANGE = "monthly";
export const YEARLY_RANGE = "yearly";
export const OVERALL_RANGE = "overall";
export const PREVIOUS_MONTH_EDGE = 0;
export const MONTHS_IN_YEAR = 12;
export const BASE_10 = 10;
export const PAD_LENGTH = 2;
export const PAD_CHAR = "0";

// ---------------------- TRANSACTION VALIDATION ----------------------
export const MIN_TRANSACTION_AMOUNT = 0;
export const MAX_TRANSACTION_AMOUNT = 1_000_000_000;
export const SPENDING_TYPE_DISCRETIONARY = "Discretionary";
export const SPENDING_TYPE_NON_DISCRETIONARY = "Non-Discretionary";
export const SPENDING_TYPE_NULL = "NULL";
export const EMERGENCY_FUND_MULTIPLIER = 6;
export const PERCENT_MULTIPLIER = 100;
export const DATE_REGEX = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;

// ---------------------- TRANSACTION VIEW ----------------------
export const SORT_DIRECTION_ASC = "asc"
export const SORT_DIRECTION_DESC = "desc"
export const SORT_LESS = -1;
export const SORT_GREATER = 1;

// ---------------------- TRANSACTION VIEW UI ELEMENTS ----------------------
export const BUTTON_STYLE = {
  padding: ACTION_BUTTON_PADDING,
  margin: BUTTON_GAP,
  backgroundColor: PRIMARY_BG,
  color: TEXT_COLOR,
  border: "none",
  borderRadius: 4,
  cursor: "pointer"
};

export const DELETE_BUTTON_STYLE = {
  ...BUTTON_STYLE,
  backgroundColor: "darkred"
};

export const CELL_STYLE = {
  border: `2px solid ${PRIMARY_BG}`,
  padding: 8,
  fontSize: TABLE_ROW_FONT_SIZE
};

export const SORT_BUTTON_STYLE = {
  marginLeft: 5,
  padding: RANGE_BUTTON_PADDING,
  fontSize: RANGE_BUTTON_FONT_SIZE,
  cursor: "pointer",
  borderRadius: 4,
  border: `1px solid ${PRIMARY_BG}`,
  backgroundColor: SECONDARY_BG
};

export const MODAL_OVERLAY_STYLE = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

export const MODAL_CONTENT_STYLE = {
  backgroundColor: SECONDARY_BG,
  padding: FORM_PADDING,
  borderRadius: INPUT_BORDER_RADIUS,
  width: FORM_WIDTH,
  display: "flex",
  flexDirection: "column",
  gap: BUTTON_STYLE.margin 
};
