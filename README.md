DESCRIPTION

This is a full‑stack personal finance tracking application built with React, Node.js/Express, and SQLite3. It allows users to track income and expenses, categorize transactions, analyze spending patterns, and view financial trends across both monthly and yearly timeframes.

FEATURES
User and Security
- user registration and login
- secure password hashing

Transactions
- add income and expenses
- various fields for income and expenses (amount, date, category, description, type)
- editing and deleting existing transactions
- categories such as rent, food, transport, discretionary, non-discretionary
- sort transactions by traits (e.g. amount)

Stastistics and Insights
- General statistics including months of runway, income to expense ratio, savings rate
- Income and Expense statistics showing change in income and expenses over time using both graphs and percentages
- A trends page which shows the fastest growing income and expenses by category and the change in each category between two periods of time
- Switch between monthly and yearly views

Data Persistence
- SQLite3 database
- Persistent stroage of all user transactions linked to a user ID

TECH STACK
- Frontend: React (JS)
- Backend: Node.js + Express
- Database: SQLite3
- Authentication: Password hashing through bcrypt

HOW TO USE
1. clone the repository
2. cd backend and run "npm install" to install dependencies
3. start the backend server by running "node server.js" in the backend folder
4. create a new terminal and navigate to the frontend folder
5. run "npm install" in the frontend folder to install dependencies
6. run "npm start" to launch the webpage
