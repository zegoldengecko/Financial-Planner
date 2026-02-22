const TOP_LIMIT = 5;

// ---------------------- DATE CONSTANTS ----------------------
const DATE_DAY_START = 1;
const DATE_MONTH_START = 4;
const DATE_YEAR_START = 7;
const DATE_DAY_LENGTH = 2;
const DATE_MONTH_LENGTH = 2;
const DATE_YEAR_LENGTH = 4;

// ---------------------- TRANSACTION TYPE ----------------------
const TYPE_INCOME = "income";
const TYPE_EXPENSE = "expense";
const TYPE_SAVINGS = "savings";

// ---------------------- SAVINGS TYPE ----------------------
const SAVINGS_DEPOSIT = "Deposit";
const SAVINGS_WITHDRAWAL = "Withdrawal"; 

// ---------------------- SERVER ----------------------
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const SESSION_SECRET = process.env.SESSION_SECRET || "supersecretkey";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const BCRYPT_SALT_ROUNDS = 10;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || "gmail";
const EMAIL_USER = process.env.EMAIL_USER || "financialplanner602@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "hxsh bnit gswf ghmg";
const EMAIL_SENDER_NAME = "Financial Planner";
const DEFAULT_AMOUNT = 0;

module.exports = {
  TOP_LIMIT,
  DATE_DAY_START,
  DEFAULT_AMOUNT,
  DATE_MONTH_START,
  DATE_YEAR_START,
  DATE_DAY_LENGTH,
  DATE_MONTH_LENGTH,
  DATE_YEAR_LENGTH,
  TYPE_INCOME,
  TYPE_EXPENSE,
  TYPE_SAVINGS,
  SAVINGS_DEPOSIT,
  SAVINGS_WITHDRAWAL,
  PORT,
  FRONTEND_URL,
  SESSION_SECRET,
  ONE_DAY_MS,
  BCRYPT_SALT_ROUNDS,
  EMAIL_SERVICE,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_SENDER_NAME
};