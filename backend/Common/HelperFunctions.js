const database = require("../database");
const nodemailer = require("nodemailer");

// ---------------------- CONSTANTS ----------------------
const {
  TOP_LIMIT,
  DATE_MONTH_START,
  DATE_YEAR_START,
  DATE_MONTH_LENGTH,
  DATE_YEAR_LENGTH,
  DEFAULT_AMOUNT,
  EMAIL_SENDER_NAME,
  EMAIL_USER,
  EMAIL_PASS
} = require("./Constants.js");

// Setting up the transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS 
  }
});

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
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

// Extract user ID and date query paramter form the request
function getUserAndDate(req) {
  return { userId: req.session.userId, date: req.query.date };
}

// Calculates the total sum of transaction amounts over a period of time
function handleTotalByType(res, userId, date, type) {
  const dateFilter = getDateFilter(date);

  const query = `
    SELECT SUM(amount) AS total
    FROM transactions
    WHERE type = '${type}'
      AND user_id = ?
      ${dateFilter}
  `;

  database.get(query, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: row?.total || DEFAULT_AMOUNT });
  });
}

// Retreives top N transactions by type
function handleLargestByType(res, userId, date, type, responseKey) {
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

  database.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ [responseKey]: rows || [] });
  });
}

// Aggregates transactions based on category
function handleCategoryAggregation(res, userId, date, type, responseKey) {
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

  database.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = (rows || []).map(row => ({
      name: row.category,
      value: row.total || DEFAULT_AMOUNT
    }));

    res.json({ [responseKey]: formatted });
  });
}

// Gets data from a transaction
function getTransactionData(req) {
  const userId = req.session.userId;
  const { type, category, spendingType, amount, date, description } = req.body;
  return { userId, type, category, spendingType, amount, date, description };
}

// Sends a welcome email
async function sendWelcomeEmail(email, username) {
  try {
    await transporter.sendMail({
      from: `"${EMAIL_SENDER_NAME}" <${EMAIL_USER}>`,
      to: email,
      subject: "Welcome to the Financial Planner",
      text: `Hi ${username}, thank you for registering for Financial Planner! Your account has been created.`,
    });
  } catch (err) {
    console.error("Email failed:", err);
  }
}

module.exports = {
  getDateFilter,
  requireAuth,
  getUserAndDate,
  handleTotalByType,
  handleLargestByType,
  handleCategoryAggregation,
  getTransactionData,
  sendWelcomeEmail
};
