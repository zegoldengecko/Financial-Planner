import { calculateStats, getSpendingType } from "../utils/plannerHelpers.js";
import { formatCurrentDate, formatPreviousDate } from "../utils/dateHelpers.js";

const basePeriodTransactions = [
  { period: "Jan", income: 5000, expense: 3000 },
  { period: "Feb", income: 4000, expense: 2000 },
];

const baseStats = {
  totalIncome: 5000,
  totalExpenses: 2000,
  prevIncome: 4000,
  prevExpenses: 1500,
  totalSavings: 10000,
  periodTransactions: basePeriodTransactions,
};

// ---------------------- CALCULATE STATS ----------------------
describe("calculateStats - savings rate", () => {
  test("calculates savings rate correctly", () => {
    const { savingsRate } = calculateStats(baseStats);
    expect(parseFloat(savingsRate)).toBe(60.00);
  });

  test("returns 0 savings rate when income is 0", () => {
    const { savingsRate } = calculateStats({ ...baseStats, totalIncome: 0 });
    expect(savingsRate).toBe(0);
  });

  test("returns 0 savings rate when expenses equal income", () => {
    const { savingsRate } = calculateStats({ ...baseStats, totalExpenses: 5000 });
    expect(parseFloat(savingsRate)).toBe(0);
  });

  test("returns negative savings rate when expenses exceed income", () => {
    const { savingsRate } = calculateStats({ ...baseStats, totalExpenses: 6000 });
    expect(parseFloat(savingsRate)).toBeLessThan(0);
  });
});

describe("calculateStats - EI ratio", () => {
  test("calculates EI ratio correctly", () => {
    const { EIRatio } = calculateStats(baseStats);
    expect(parseFloat(EIRatio)).toBe(0.40);
  });

  test("returns 0 EI ratio when income is 0", () => {
    const { EIRatio } = calculateStats({ ...baseStats, totalIncome: 0 });
    expect(EIRatio).toBe(0);
  });

  test("returns 1.00 when expenses equal income", () => {
    const { EIRatio } = calculateStats({ ...baseStats, totalExpenses: 5000 });
    expect(parseFloat(EIRatio)).toBe(1.00);
  });
});

describe("calculateStats - runway", () => {
  test("calculates runway correctly", () => {
    const { runway } = calculateStats(baseStats);
    expect(runway).toBe(5);
  });

  test("floors runway to nearest month", () => {
    const { runway } = calculateStats({ ...baseStats, totalSavings: 10001, totalExpenses: 2000 });
    expect(runway).toBe(5);
  });

  test("returns 0 runway when expenses are 0", () => {
    const { runway } = calculateStats({ ...baseStats, totalExpenses: 0 });
    expect(runway).toBe(0);
  });

  test("returns 0 runway when savings are 0", () => {
    const { runway } = calculateStats({ ...baseStats, totalSavings: 0 });
    expect(runway).toBe(0);
  });
});

describe("calculateStats - emergency fund", () => {
  test("calculates emergency fund as 6x monthly expenses", () => {
    const { emergencyFund } = calculateStats(baseStats);
    expect(emergencyFund).toBe(12000); // 2000 * 6
  });

  test("returns 0 emergency fund when expenses are 0", () => {
    const { emergencyFund } = calculateStats({ ...baseStats, totalExpenses: 0 });
    expect(emergencyFund).toBe(0);
  });
});

describe("calculateStats - income/expense change", () => {
  test("calculates income change correctly", () => {
    const { incomeChange, incomeChangePercent } = calculateStats(baseStats);
    expect(incomeChange).toBe(1000);
    expect(parseFloat(incomeChangePercent)).toBe(25);
  });

  test("calculates expense change correctly", () => {
    const { expenseChange, expenseChangePercent } = calculateStats(baseStats);
    expect(expenseChange).toBe(500);
    expect(parseFloat(expenseChangePercent)).toBe(33);
  });

  test("returns 0 income change percent when previous income is 0", () => {
    const { incomeChangePercent } = calculateStats({ ...baseStats, prevIncome: 0 });
    expect(incomeChangePercent).toBe(0);
  });

  test("returns 0 expense change percent when previous expenses are 0", () => {
    const { expenseChangePercent } = calculateStats({ ...baseStats, prevExpenses: 0 });
    expect(expenseChangePercent).toBe(0);
  });
});

describe("calculateStats - period cashflow mapping", () => {
  test("maps period cashflow correctly", () => {
    const { periodCashflow } = calculateStats(baseStats);
    expect(periodCashflow).toEqual([
      { period: "Jan", net: 2000 },
      { period: "Feb", net: 2000 },
    ]);
  });

  test("maps period income correctly", () => {
    const { periodIncome } = calculateStats(baseStats);
    expect(periodIncome).toEqual([
      { period: "Jan", income: 5000 },
      { period: "Feb", income: 4000 },
    ]);
  });

  test("maps period expenses correctly", () => {
    const { periodExpenses } = calculateStats(baseStats);
    expect(periodExpenses).toEqual([
      { period: "Jan", expense: 3000 },
      { period: "Feb", expense: 2000 },
    ]);
  });

  test("returns empty arrays for empty period transactions", () => {
    const { periodCashflow, periodIncome, periodExpenses } = calculateStats({ ...baseStats, periodTransactions: [] });
    expect(periodCashflow).toEqual([]);
    expect(periodIncome).toEqual([]);
    expect(periodExpenses).toEqual([]);
  });
});

// ---------------------- GET SPENDING TYPE ----------------------
describe("getSpendingType", () => {
  test("returns Discretionary for Travel", () => {
    expect(getSpendingType("Travel")).toBe("Discretionary");
  });

  test("returns Discretionary for Leisure", () => {
    expect(getSpendingType("Leisure")).toBe("Discretionary");
  });

  test("returns Discretionary for Clothes", () => {
    expect(getSpendingType("Clothes")).toBe("Discretionary");
  });

  test("returns Discretionary for Other Expense", () => {
    expect(getSpendingType("Other Expense")).toBe("Discretionary");
  });

  test("returns Non-Discretionary for Rent", () => {
    expect(getSpendingType("Rent")).toBe("Non-Discretionary");
  });

  test("returns Non-Discretionary for Food", () => {
    expect(getSpendingType("Food")).toBe("Non-Discretionary");
  });

  test("returns Non-Discretionary for Utilities", () => {
    expect(getSpendingType("Utilities")).toBe("Non-Discretionary");
  });

  test("returns NULL for unknown category", () => {
    expect(getSpendingType("Gambling")).toBe("NULL");
  });

  test("returns NULL for empty string", () => {
    expect(getSpendingType("")).toBe("NULL");
  });
});

// ---------------------- FORMAT CURRENT DATE ----------------------
describe("formatCurrentDate", () => {
  test("returns year-month for monthly range", () => {
    expect(formatCurrentDate("2026", "03", "monthly")).toBe("2026-03");
  });

  test("returns year for yearly range", () => {
    expect(formatCurrentDate("2026", "03", "yearly")).toBe("2026");
  });

  test("returns 'overall' for overall range", () => {
    expect(formatCurrentDate("2026", "03", "overall")).toBe("overall");
  });
});

// ---------------------- FORMAT PREVIOUS DATE ----------------------
describe("formatPreviousDate", () => {
  test("returns previous month in same year", () => {
    expect(formatPreviousDate("2026", "06", "monthly")).toBe("2026-05");
  });

  test("handles January rollover to December of previous year", () => {
    expect(formatPreviousDate("2026", "01", "monthly")).toBe("2025-12");
  });

  test("pads single digit months with leading zero", () => {
    expect(formatPreviousDate("2026", "10", "monthly")).toBe("2026-09");
  });

  test("returns previous year for yearly range", () => {
    expect(formatPreviousDate("2026", "01", "yearly")).toBe("2025");
  });

  test("returns 'overall' for overall range", () => {
    expect(formatPreviousDate("2026", "01", "overall")).toBe("overall");
  });
});