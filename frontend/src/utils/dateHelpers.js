import {
  MONTHLY_RANGE,
  YEARLY_RANGE,
  OVERALL_RANGE,
  PREVIOUS_MONTH_EDGE,
  MONTHS_IN_YEAR,
  BASE_10,
  PAD_LENGTH,
  PAD_CHAR
} from "./constants.js";

// Formatting the current date
export const formatCurrentDate = (year, month, rangeOption) => {
  if (rangeOption === MONTHLY_RANGE) return `${year}-${month}`;
  if (rangeOption === YEARLY_RANGE) return `${year}`;
  return OVERALL_RANGE;
};

// Formatting the previous date
export const formatPreviousDate = (year, month, rangeOption) => {
  if (rangeOption === MONTHLY_RANGE) {
    let y = parseInt(year, BASE_10);
    let m = parseInt(month, BASE_10) - 1;
    if (m === PREVIOUS_MONTH_EDGE) {
      m = MONTHS_IN_YEAR;
      y -= 1;
    }
    return `${y}-${String(m).padStart(PAD_LENGTH, PAD_CHAR)}`;
  }
  if (rangeOption === YEARLY_RANGE) return String(year - 1);
  return OVERALL_RANGE;
};


