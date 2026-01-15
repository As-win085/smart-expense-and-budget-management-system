Smart Expense & Budget Management System

A full-stack personal finance management application that helps users track income & expenses, manage monthly budgets, and visualize financial reports with secure authentication.

🚀 Features
🔐 Authentication

User Registration & Login

JWT-based Authentication

Auto redirect to login on token expiry

💵 Income & Expense Management

Add, edit, delete income

Add, edit, delete expenses

Category-based tracking

Date-wise records

📊 Dashboard

Total income & expense summary

Recent transactions

Real-time updates

📅 Budget Management

Monthly budget per category

Year & month-based budgeting

Budget limit alerts when exceeded

📈 Reports

Monthly income & expense reports

Category-wise spending analysis

Charts using Recharts

🎨 UI

Fully responsive UI

Tailwind CSS styling

Clean dashboard layout

🛠 Tech Stack
Frontend

React (Create React App)

Axios

React Router

Tailwind CSS

Recharts

Backend

Django

Django REST Framework

JWT Authentication (SimpleJWT)

MySQL

Gunicorn

Deployment

Frontend: Vercel

Backend: Render

Database: MySQL (Aiven / Render)

📁 Project Structure
smart-expense-budget-management-system/
│
├── backend/
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── finance/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── App.js
│   └── package.json
│
└── README.md

⚙️ Environment Variables
Backend (Render)
SECRET_KEY=your-secret-key
DEBUG=False
DB_NAME=database_name
DB_USER=db_user
DB_PASSWORD=db_password
DB_HOST=db_host
DB_PORT=3306

Frontend (Vercel)
REACT_APP_API_URL=https://your-backend.onrender.com/api

▶️ Run Locally
Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend
cd frontend
npm install
npm start

🔐 API Authentication

Obtain token:

POST /api/token/


Refresh token:

POST /api/token/refresh/


Pass token in headers:

Authorization: Bearer <access_token>

📸 Screens Included

Login & Register

Dashboard

Income Management

Expense Management

Budget Page

Reports Page

🧠 Key Learnings

Full-stack authentication with JWT

Secure API consumption from React

Token expiry handling

Data aggregation for reports

Real-world project architecture

🏆 Resume Description (You Can Copy)

Built a full-stack Smart Expense & Budget Management System using React, Django REST Framework, and MySQL. Implemented JWT authentication, income & expense tracking, monthly budgets, and interactive financial reports with Recharts. Deployed frontend on Vercel and backend on Render.

📌 Future Enhancements

PDF / Excel export

Email alerts for budget exceed

Recurring transactions

Multi-currency support

Dockerization

👨‍💻 Author

Aswin Biju
Full Stack Developer (React + Django)
