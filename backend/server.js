const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const database = require("./database");
const nodemailer = require("nodemailer");
const session = require("express-session");

const statsRoutes = require("./stats");

// ---------------------- CONSTANTS ----------------------
const {
  PORT,
  FRONTEND_URL,
  SESSION_SECRET,
  ONE_DAY_MS,
  BCRYPT_SALT_ROUNDS,
  EMAIL_SERVICE,
  EMAIL_USER,
  EMAIL_PASS
} = require("./Common/Constants.js");

// ---------------------- HELPERS ----------------------
const {
  sendWelcomeEmail,
  requireAuth,
  getTransactionData
} = require("./Common/HelperFunctions.js");

// ---------------------- SETUP ----------------------
const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const app = express();

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: ONE_DAY_MS
  }
}));

app.use(bodyParser.json());
app.use("/api/stats", statsRoutes);

// ---------------------- REGISTRATION ----------------------
app.post("/api/register", async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    database.run(
      "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
      [email, username, hashedPassword],
      async function (err) {
        if (err) {
          console.error(err.message);
          return res.status(400).json({ message: "User already exists" });
        }

        await sendWelcomeEmail(email, username);
        res.json({ message: "User registered successfully" });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------- LOGIN ----------------------
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  database.get("SELECT * FROM users WHERE username = ?", [username], async (error, user) => {
    if (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ message: "Server error" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    req.session.userId = user.id;
    res.json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email } });
  });
});

// ---------------------- ADD TRANSACTION ----------------------
app.post("/api/add", requireAuth, (req, res) => {
  const { userId, type, category, spendingType, amount, date, description } = getTransactionData(req);

  if (!type || !category || !spendingType || !amount || !date) {
    return res.status(400).json({ message: "Issues with data" });
  }

  const query = `
    INSERT INTO transactions (user_id, type, spendingType, category, amount, date, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  database.run(query, [userId, type, spendingType, category, amount, date, description || ""], function(err) {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Could not add transaction" });
    }

    res.json({ message: "Transaction added successfully", transactionId: this.lastID });
  });
});

// ---------------------- GET TRANSACTIONS ----------------------
app.get("/api/transactions", requireAuth, (req, res) => {
  const userId = req.session.userId;
  const TRANSACTION_FIELDS = "id, type, category, spendingType, amount, date, description";

  database.all(
    `SELECT ${TRANSACTION_FIELDS} FROM transactions WHERE user_id = ? ORDER BY date DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(rows);
    }
  );
});

// ---------------------- EDIT TRANSACTION ----------------------
app.put("/api/transactions/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const { userId, type, category, spendingType, amount, date, description } = getTransactionData(req);

  database.run(
    `
    UPDATE transactions
    SET type = ?, category = ?, spendingType = ?, amount = ?, date = ?, description = ?
    WHERE id = ? AND user_id = ?
    `,
    [type, category, spendingType, amount, date, description, id, userId],
    function (err) {
      if (err) return res.status(500).json({ error: "Database error" });
      if (this.changes === 0) return res.status(404).json({ error: "Transaction not found" });
      res.json({ success: true });
    }
  );
});

// ---------------------- DELETE TRANSACTION ----------------------
app.delete("/api/transactions/:id", requireAuth, (req, res) => {
  const userId = req.session.userId;
  const transactionId = req.params.id;

  database.run(
    `DELETE FROM transactions WHERE id = ? AND user_id = ?`,
    [transactionId, userId],
    function (err) {
      if (err) return res.status(500).json({ error: "Database error" });
      if (this.changes === 0) return res.status(404).json({ error: "Not found" });
      res.json({ message: "Deleted" });
    }
  );
});

// ---------------------- START SERVER ----------------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
