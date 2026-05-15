const database = require("../database");
const jwt = require("jsonwebtoken");

// ---------------------- CONSTANTS ----------------------
const {
  TOP_LIMIT,
  DATE_MONTH_START,
  DATE_YEAR_START,
  DATE_MONTH_LENGTH,
  DATE_YEAR_LENGTH,
  DEFAULT_AMOUNT,
  JWT_SECRET
} = require("./Constants.js");

// ---------------------- HELPERS ----------------------
// Generates an SQL WHERE clause to filter transactions by a given date
const getDateFilter = (date) => {
  if (!date || date === "overall") return "";

  if (/^\d{4}-\d{2}$/.test(date)) {
    const [year, month] = date.split("-");
    return `
      AND substr(date, ${DATE_MONTH_START}, ${DATE_MONTH_LENGTH}) = '${month}'
      AND substr(date, ${DATE_YEAR_START}, ${DATE_YEAR_LENGTH}) = '${year}'
    `;
  }

  if (/^\d{4}$/.test(date)) {
    return `AND substr(date, ${DATE_YEAR_START}, ${DATE_YEAR_LENGTH}) = '${date}'`;
  }

  return "";
};

// Enforces that a user is logged in
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Extract user ID and date query parameter from the request
function getUserAndDate(req) {
  return { userId: req.userId, date: req.query.date };
}

// Calculates the total sum of transaction amounts over a period of time
async function handleTotalByType(res, userId, date, type) {
  const dateFilter = getDateFilter(date);

  const query = `
    SELECT SUM(amount) AS total
    FROM transactions
    WHERE type = '${type}'
      AND user_id = ?
      ${dateFilter}
  `;

  try {
    const result = await database.execute({ sql: query, args: [userId] });
    res.json({ total: result.rows[0]?.total || DEFAULT_AMOUNT });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Retrieves top N transactions by type
async function handleLargestByType(res, userId, date, type, responseKey) {
  const dateFilter = getDateFilter(date);

  const query = `
    SELECT amount, category, date
    FROM transactions
    WHERE type = '${type}'
      AND user_id = ?
      ${dateFilter}
    ORDER BY amount DESC
    LIMIT ${TOP_LIMIT}
  `;

  try {
    const result = await database.execute({ sql: query, args: [userId] });
    res.json({ [responseKey]: result.rows || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Aggregates transactions based on category
async function handleCategoryAggregation(res, userId, date, type, responseKey) {
  const dateFilter = getDateFilter(date);

  const query = `
    SELECT category, SUM(amount) AS total
    FROM transactions
    WHERE type = '${type}'
      AND user_id = ?
      ${dateFilter}
    GROUP BY category
    ORDER BY total DESC
  `;

  try {
    const result = await database.execute({ sql: query, args: [userId] });

    const formatted = (result.rows || []).map(row => ({
      name: row.category,
      value: row.total || DEFAULT_AMOUNT
    }));

    res.json({ [responseKey]: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Gets data from a transaction
function getTransactionData(req) {
  const userId = req.userId;
  const { type, category, spendingType, amount, date, description } = req.body;
  return { userId, type, category, spendingType, amount, date, description };
}

module.exports = {
  getDateFilter,
  requireAuth,
  getUserAndDate,
  handleTotalByType,
  handleLargestByType,
  handleCategoryAggregation,
  getTransactionData
};