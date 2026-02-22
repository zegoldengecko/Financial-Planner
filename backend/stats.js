const express = require("express");
const router = express.Router();
const database = require("./database");

// ---------------------- CONSTANTS ----------------------
const {
  TOP_LIMIT,
  DATE_DAY_START,
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
  DEFAULT_AMOUNT
} = require("./Common/Constants.js");

// ---------------------- HELPERS ----------------------
const {
  getDateFilter,
  requireAuth,
  getUserAndDate,
  handleTotalByType,
  handleLargestByType,
  handleCategoryAggregation
} = require("./Common/HelperFunctions.js");

router.use(requireAuth);

// ---------------------- TOTALS ----------------------
router.get("/total-income", (req, res) => {
  const { userId, date } = getUserAndDate(req);
  handleTotalByType(res, userId, date, TYPE_INCOME);
});

router.get("/total-expenses", (req, res) => {
  const { userId, date } = getUserAndDate(req);
  handleTotalByType(res, userId, date, TYPE_EXPENSE);
});

router.get("/total-savings", (req, res) => {
  const { userId, date } = getUserAndDate(req);
  const dateFilter = getDateFilter(date);

  const query = `
    SELECT SUM(
      CASE 
        WHEN category = '${SAVINGS_DEPOSIT}' THEN amount
        WHEN category = '${SAVINGS_WITHDRAWAL}' THEN -amount
        ELSE 0
      END
    ) AS total
    FROM transactions
    WHERE type = '${TYPE_SAVINGS}'
      AND user_id = ?
      ${dateFilter}
  `;

  database.get(query, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: row?.total || DEFAULT_AMOUNT });
  });
});

// ---------------------- TOP TRANSACTIONS ----------------------
router.get("/largest-income", (req, res) => {
  const { userId, date } = getUserAndDate(req);
  handleLargestByType(res, userId, date, TYPE_INCOME, "topIncome");
});

router.get("/largest-expense", (req, res) => {
  const { userId, date } = getUserAndDate(req);
  handleLargestByType(res, userId, date, TYPE_EXPENSE, "topExpense");
});

// ---------------------- FASTEST GROWING CATEGORIES ----------------------
const formatDateMMYYYY = (d) => {
  if (/^\d{4}-\d{2}$/.test(d)) {
    const [year, month] = d.split("-");
    return `${month}/${year}`;
  }
  return d;
};

function handleFastestGrowing(res, userId, type, date, prevDate, responseKey) {
  if (!date || !prevDate) {
    return res.status(400).json({ error: "Error with dates" });
  }

  const currentDateFilter = getDateFilter(date);
  const previousDateFilter = getDateFilter(prevDate);
  const dateRange = `${formatDateMMYYYY(prevDate)}-${formatDateMMYYYY(date)}`;

  const query = `
    SELECT *
    FROM (
      SELECT
        (c.total_current - IFNULL(p.total_prev, 0)) AS amount,
        c.category AS category,
        ? AS date
      FROM (
        SELECT category, SUM(amount) AS total_current
        FROM transactions
        WHERE type='${type}'
          AND user_id=?
          ${currentDateFilter}
        GROUP BY category
      ) c
      LEFT JOIN (
        SELECT category, SUM(amount) AS total_prev
        FROM transactions
        WHERE type='${type}'
          AND user_id=?
          ${previousDateFilter}
        GROUP BY category
      ) p
      ON c.category = p.category
    )
    WHERE amount > 0
    ORDER BY amount DESC
    LIMIT ${TOP_LIMIT};
  `;

  database.all(query, [dateRange, userId, userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = (rows || []).map(r => ({
      category: r.category,
      amount: Number(r.amount),
      date: r.date
    }));

    res.json({ [responseKey]: formatted });
  });
}

router.get("/fastest-growing-income", (req, res) => {
  const { userId, date } = getUserAndDate(req);
  const prevDate = req.query.prevDate;
  handleFastestGrowing(res, userId, TYPE_INCOME, date, prevDate, "fastestGrowingIncomes");
});

router.get("/fastest-growing-expenses", (req, res) => {
  const { userId, date } = getUserAndDate(req);
  const prevDate = req.query.prevDate;
  handleFastestGrowing(res, userId, TYPE_EXPENSE, date, prevDate, "fastestGrowingExpenses");
});

// ---------------------- CATEGORY GROUPS ----------------------
router.get("/category-income", (req, res) => {
  const { userId, date } = getUserAndDate(req);
  handleCategoryAggregation(res, userId, date, TYPE_INCOME, "incomeByCategory");
});

router.get("/category-expenses", (req, res) => {
  const { userId, date } = getUserAndDate(req);
  handleCategoryAggregation(res, userId, date, TYPE_EXPENSE, "expensesByCategory");
});

// ---------------------- SPENDING TYPE ----------------------
router.get("/spending-type", (req, res) => {
  const { userId, date } = getUserAndDate(req);
  const dateFilter = getDateFilter(date);

  const query = `
    SELECT spendingType AS type, SUM(amount) AS total
    FROM transactions
    WHERE type = '${TYPE_EXPENSE}'
      AND user_id = ?
      ${dateFilter}
    GROUP BY spendingType
    ORDER BY total DESC
  `;

  database.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = (rows || []).map(row => ({
      name: row.type,
      value: row.total || DEFAULT_AMOUNT
    }));

    res.json({ expensesBySpendingType: formatted });
  });
});

// ---------------------- PERIOD TRANSACTIONS ----------------------
router.get("/period-transactions", (req, res) => {
  const { userId, date } = getUserAndDate(req);

  if (!date) return res.status(400).json({ error: "Date is required" });

  let query = "";
  let params = [userId];

  if (date === "overall") {
    query = `
      SELECT
        'Overall' AS period,
        SUM(CASE WHEN type = '${TYPE_INCOME}' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = '${TYPE_EXPENSE}' THEN amount ELSE 0 END) AS expense
      FROM transactions
      WHERE user_id = ?
    `;
  } else if (/^\d{4}-\d{2}$/.test(date)) {
    const [year, month] = date.split("-");
    query = `
      SELECT
        substr(date, ${DATE_DAY_START}, ${DATE_DAY_LENGTH}) AS period,
        SUM(CASE WHEN type = '${TYPE_INCOME}' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = '${TYPE_EXPENSE}' THEN amount ELSE 0 END) AS expense
      FROM transactions
      WHERE user_id = ?
        AND substr(date, ${DATE_MONTH_START}, ${DATE_MONTH_LENGTH}) = ?
        AND substr(date, ${DATE_YEAR_START}, ${DATE_YEAR_LENGTH}) = ?
      GROUP BY substr(date, ${DATE_DAY_START}, ${DATE_DAY_LENGTH})
      ORDER BY substr(date, ${DATE_DAY_START}, ${DATE_DAY_LENGTH})
    `;
    params.push(month, year);
  } else if (/^\d{4}$/.test(date)) {
    const year = date;
    query = `
      SELECT
        substr(date, ${DATE_MONTH_START}, ${DATE_MONTH_LENGTH}) AS period,
        SUM(CASE WHEN type = '${TYPE_INCOME}' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = '${TYPE_EXPENSE}' THEN amount ELSE 0 END) AS expense
      FROM transactions
      WHERE user_id = ?
        AND substr(date, ${DATE_YEAR_START}, ${DATE_YEAR_LENGTH}) = ?
      GROUP BY substr(date, ${DATE_MONTH_START}, ${DATE_MONTH_LENGTH})
      ORDER BY substr(date, ${DATE_MONTH_START}, ${DATE_MONTH_LENGTH})
    `;
    params.push(year);
  } else {
    return res.status(400).json({ error: "Invalid date format" });
  }

  database.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = (rows || []).map(row => ({
      period: row.period,
      income: row.income || DEFAULT_AMOUNT,
      expense: row.expense || DEFAULT_AMOUNT
    }));

    res.json({ data: formatted });
  });
});

// ---------------------- CATEGORY GROWTH ----------------------
router.get("/category-growth", (req, res) => {
  const { userId, date } = getUserAndDate(req);
  const prevDate = req.query.prevDate;

  if (!date || !prevDate) return res.status(400).json({ error: "Error with dates" });

  const currentDateFilter = getDateFilter(date);
  const previousDateFilter = getDateFilter(prevDate);
  const dateRange = `${formatDateMMYYYY(prevDate)}-${formatDateMMYYYY(date)}`;

  const query = `
    SELECT
      (IFNULL(c.total_current, 0) - IFNULL(p.total_prev, 0)) AS amount,
      COALESCE(c.category, p.category) AS category,
      COALESCE(c.type, p.type) AS type,
      ? AS date
    FROM (
      SELECT category, type FROM transactions
      WHERE user_id=? ${currentDateFilter}
      UNION
      SELECT category, type FROM transactions
      WHERE user_id=? ${previousDateFilter}
    ) cats
    LEFT JOIN (
      SELECT category, type, SUM(amount) AS total_current
      FROM transactions
      WHERE user_id=? ${currentDateFilter}
      GROUP BY category, type
    ) c ON cats.category = c.category AND cats.type = c.type
    LEFT JOIN (
      SELECT category, type, SUM(amount) AS total_prev
      FROM transactions
      WHERE user_id=? ${previousDateFilter}
      GROUP BY category, type
    ) p ON cats.category = p.category AND cats.type = p.type
    ORDER BY amount DESC
  `;

  database.all(query, [dateRange, userId, userId, userId, userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = (rows || []).map(r => ({
      category: r.category,
      growth: Number(r.amount),
      type: r.type
    }));

    res.json({ changeInCategories: formatted });
  });
});

module.exports = router;
