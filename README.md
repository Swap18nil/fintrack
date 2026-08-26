# 💰 FinTrack — Personal Finance & Expense Management Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel)](https://fintrack-ten-jet.vercel.app/  )
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**FinTrack** is a production-grade, full-stack personal finance web application built to help users seamlessly monitor real-time cash flow, manage category-based monthly budgets, and automate recurring bill notifications.

---

## ✨ Key Features

* **Real-Time Cash Flow Analytics:** Dynamic financial overview cards and interactive charts calculating net balance, total income, and total expenses instantly.
* **Relational Budget Engine:** Custom budgeting setup allowing users to establish maximum monthly spending limits across multiple financial categories, cross-referenced live against active ledger transactions with progress indicators.
* **Automated Event-Driven Reminders:** Recurring bill tracking with automated email alerts powered by **EmailJS** and database-backed flags to prevent duplicate notifications.
* **Secure Data Isolation:** Multi-user data privacy protected using **Supabase Row-Level Security (RLS)** policies.
* **Responsive UI/UX:** Clean, modern single-page application built with **Tailwind CSS**, featuring a collapsible custom sidebar layout and multi-currency support.

---

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide Icons
* **Backend & Database:** Supabase (PostgreSQL, RLS Policies, Relational Schemas)
* **Integrations:** EmailJS (Automated alert dispatches)
* **Deployment:** Vercel

---

## 🚀 Local Installation & Running

Follow these steps to run the project locally on your machine:

1. Clone the repository
```bash
git clone [https://github.com/Swap18nil/fintrack.git](https://github.com/Swap18nil/fintrack.git)
cd fintrack

2. Install dependencies
npm install

3. Configure Environment Variables
Create a .env file in the root directory and add your keys:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

4. Run the development server
npm run dev

👤 Author
Swapnil Sanap
