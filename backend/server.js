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
    secure: true,
    httpOnly: true,
    sameSite: "none",
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

    await database.execute({
      sql: "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
      args: [email, username, hashedPassword]
    });

    sendWelcomeEmail(email, username);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    if (err.message && err.message.includes("UNIQUE")) {
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------- LOGIN ----------------------
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
 
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
 
  try {
    const result = await database.execute({
      sql: "SELECT * FROM users WHERE username = ?",
      args: [username]
    });
 
    const user = result.rows[0];
 
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
 
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
 
    req.session.userId = user.id;
    res.json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------- ADD TRANSACTION ----------------------
app.post("/api/add", requireAuth, async (req, res) => {
  const { userId, type, category, spendingType, amount, date, description } = getTransactionData(req);
 
  if (!type || !category || !spendingType || !amount || !date) {
    return res.status(400).json({ message: "Issues with data" });
  }
 
  const query = `
    INSERT INTO transactions (user_id, type, spendingType, category, amount, date, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
 
  try {
    const result = await database.execute({
      sql: query,
      args: [userId, type, spendingType, category, amount, date, description || ""]
    });
 
    res.json({ message: "Transaction added successfully", transactionId: Number(result.lastInsertRowid) });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ message: "Could not add transaction" });
  }
});

// ---------------------- GET TRANSACTIONS ----------------------
app.get("/api/transactions", requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const TRANSACTION_FIELDS = "id, type, category, spendingType, amount, date, description";
 
  try {
    const result = await database.execute({
      sql: `SELECT ${TRANSACTION_FIELDS} FROM transactions WHERE user_id = ? ORDER BY date DESC`,
      args: [userId]
    });
 
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// ---------------------- EDIT TRANSACTION ----------------------
app.put("/api/transactions/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { userId, type, category, spendingType, amount, date, description } = getTransactionData(req);
 
  try {
    const result = await database.execute({
      sql: `
        UPDATE transactions
        SET type = ?, category = ?, spendingType = ?, amount = ?, date = ?, description = ?
        WHERE id = ? AND user_id = ?
      `,
      args: [type, category, spendingType, amount, date, description, id, userId]
    });
 
    if (result.rowsAffected === 0) return res.status(404).json({ error: "Transaction not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// ---------------------- DELETE TRANSACTION ----------------------
app.delete("/api/transactions/:id", requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const transactionId = req.params.id;
 
  try {
    const result = await database.execute({
      sql: `DELETE FROM transactions WHERE id = ? AND user_id = ?`,
      args: [transactionId, userId]
    });
 
    if (result.rowsAffected === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// ---------------------- START SERVER ----------------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
