// db.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./users.db"); // creates users.db in project folder

db.serialize(() => {
  // Create users table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      username TEXT UNIQUE,
      password TEXT
    )
  `, (err) => {
    if (err) {
      console.error("Error creating table", err.message);
    }
  });

  // Creating a transactions table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,           -- income or expense
      category TEXT NOT NULL,
      spendingType TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,           -- store as DD/MM/YYYY
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error("Error creating transactions table:", err.message);
    }
  });
});

module.exports = db;
