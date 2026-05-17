import { validateTransaction } from "../utils/plannerHelpers.js";

const validTransaction = {
  type: "expense",
  category: "Food",
  amount: "50.00",
  date: "01/01/2026"
};

// ---------------------- MISSING FIELDS ----------------------
describe("validateTransaction - missing fields", () => {
  test("returns error when all fields are missing", () => {
    expect(validateTransaction({ type: "", category: "", amount: "", date: "" })).toBe("Required fields are empty");
  });

  test("returns error when type is missing", () => {
    expect(validateTransaction({ ...validTransaction, type: "" })).toBe("Required fields are empty");
  });

  test("returns error when category is missing", () => {
    expect(validateTransaction({ ...validTransaction, category: "" })).toBe("Required fields are empty");
  });

  test("returns error when amount is missing", () => {
    expect(validateTransaction({ ...validTransaction, amount: "" })).toBe("Required fields are empty");
  });

  test("returns error when date is missing", () => {
    expect(validateTransaction({ ...validTransaction, date: "" })).toBe("Required fields are empty");
  });
});

// ---------------------- AMOUNT VALIDATION ----------------------
describe("validateTransaction - amount", () => {
  test("returns error for zero amount", () => {
    expect(validateTransaction({ ...validTransaction, amount: "0" })).toMatch(/Invalid amount/);
  });

  test("returns error for negative amount", () => {
    expect(validateTransaction({ ...validTransaction, amount: "-10" })).toMatch(/Invalid amount/);
  });

  test("returns error for amount at or above 1,000,000,000", () => {
    expect(validateTransaction({ ...validTransaction, amount: "1000000000" })).toMatch(/Invalid amount/);
  });

  test("returns error for non-numeric amount", () => {
    expect(validateTransaction({ ...validTransaction, amount: "abc" })).toMatch(/Invalid amount/);
  });

  test("accepts valid amount with dollar sign and comma", () => {
    expect(validateTransaction({ ...validTransaction, amount: "$1,000.00" })).toBeNull();
  });

  test("accepts amount just below max", () => {
    expect(validateTransaction({ ...validTransaction, amount: "999999999" })).toBeNull();
  });

  test("accepts minimum valid amount", () => {
    expect(validateTransaction({ ...validTransaction, amount: "0.01" })).toBeNull();
  });
});

// ---------------------- DATE FORMAT VALIDATION ----------------------
describe("validateTransaction - date format", () => {
  test("returns error for date in YYYY-MM-DD format", () => {
    expect(validateTransaction({ ...validTransaction, date: "2026-01-01" })).toBe("Invalid date.");
  });

  test("returns error for date missing year", () => {
    expect(validateTransaction({ ...validTransaction, date: "01/01" })).toBe("Invalid date.");
  });

  test("returns error for date with invalid month", () => {
    expect(validateTransaction({ ...validTransaction, date: "01/13/2026" })).toBe("Invalid date.");
  });

  test("returns error for date with invalid day", () => {
    expect(validateTransaction({ ...validTransaction, date: "32/01/2026" })).toBe("Invalid date.");
  });

  test("returns error for completely invalid date string", () => {
    expect(validateTransaction({ ...validTransaction, date: "not-a-date" })).toBe("Invalid date.");
  });

  test("accepts valid date DD/MM/YYYY", () => {
    expect(validateTransaction({ ...validTransaction, date: "15/06/2026" })).toBeNull();
  });

  test("accepts single digit day and month", () => {
    expect(validateTransaction({ ...validTransaction, date: "1/1/2026" })).toBeNull();
  });
});

// ---------------------- YEAR RANGE VALIDATION ----------------------
describe("validateTransaction - year range", () => {
  test("returns error for year below 1976", () => {
    expect(validateTransaction({ ...validTransaction, date: "01/01/1975" })).toMatch(/Year must be between 1976 and 2076/);
  });

  test("returns error for year above 2076", () => {
    expect(validateTransaction({ ...validTransaction, date: "01/01/2077" })).toMatch(/Year must be between 1976 and 2076/);
  });

  test("accepts year at lower boundary (1976)", () => {
    expect(validateTransaction({ ...validTransaction, date: "01/01/1976" })).toBeNull();
  });

  test("accepts year at upper boundary (2076)", () => {
    expect(validateTransaction({ ...validTransaction, date: "01/01/2076" })).toBeNull();
  });
});

// ---------------------- VALID TRANSACTION ----------------------
describe("validateTransaction - valid input", () => {
  test("returns null for a fully valid transaction", () => {
    expect(validateTransaction(validTransaction)).toBeNull();
  });
});