![CI](https://github.com/zegoldengecko/Financial-Planner/actions/workflows/ci.yml/badge.svg)

DESCRIPTION

A full-stack personal finance tracking application built with React, Node.js/Express, and Turso. It allows users to track income and expenses, categorize transactions, analyze spending patterns, and 
view financial trends across both monthly and yearly timeframes. Built to replace spreadsheets for personal budgeting with a focus on easy-to-read trend analysis.
<img width="1658" height="875" alt="image" src="https://github.com/user-attachments/assets/d7ad29c3-6d7c-469b-bb66-7d1e8eaf53d8" />
<img width="2535" height="1126" alt="image" src="https://github.com/user-attachments/assets/c3b12b7b-f46f-4d0c-b45c-331a44f74167" />
<img width="2539" height="1144" alt="image" src="https://github.com/user-attachments/assets/f14225a7-1591-46d8-9adf-60d4e6e5d22b" />
<img width="2182" height="1210" alt="image" src="https://github.com/user-attachments/assets/8525d3c1-59e9-415b-93af-57d28e0b59f2" />
<img width="2553" height="1150" alt="image" src="https://github.com/user-attachments/assets/29f852f7-69ea-4453-8bb3-609abd3b257d" />
<img width="2535" height="1279" alt="image" src="https://github.com/user-attachments/assets/cae01dd4-cf2f-4b14-8c71-16e49f710811" />
<img width="2438" height="1203" alt="image" src="https://github.com/user-attachments/assets/1f3a914c-3a23-4760-a62a-5ca4cae15f09" />

FEATURES

User and Security
- User registration and login
- Secure password hashing via bcrypt
- JWT-based authentication

Transactions
- add income and expenses
- various fields for income and expenses (amount, date, category, description, type)
- editing and deleting existing transactions
- categories such as rent, food, transport, discretionary, non-discretionary
- sort transactions by traits (e.g. amount)

Statistics and Insights
- General statistics including months of runway, income to expense ratio, savings rate
- Income and Expense statistics showing change in income and expenses over time using both graphs and percentages
- A trends page which shows the fastest growing income and expenses by category and the change in each category between two periods of time
- Switch between monthly and yearly views

Data Persistence
- Turso (cloud SQLite) database
- Persistent storage of all user transactions linked to a user ID

TECH STACK
- Frontend: React (JS)
- Backend: Node.js + Express
- Database: Turso (SQLite)
- Authentication: bcrypt + JSON Web Tokens (JWT)
- Deployment: Render

See it in action at this link: https://financial-planner-oujw.onrender.com/ 