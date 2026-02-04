# 🏥 Patient Record Management System

![React](https://img.shields.io/badge/Frontend-React.js-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![Database](https://img.shields.io/badge/Database-MSSQL-red)
![License](https://img.shields.io/badge/License-MIT-orange)

A full-stack web application designed for medical clinics to efficiently manage patient records, visit history, prescriptions, and billing. Built to minimize data entry time for doctors while ensuring accurate record-keeping.

---

## 🚀 Key Features

### 📋 **Patient Management**
- **Smart Data Entry:** Streamlined form for patient details (Name, Father's Name, Age, Gender, Mobile, Address).
- **Validation:** Strict checks to prevent errors (e.g., Age limit ≤ 110, Mobile number length validation).
- **Auto-Complete:** Real-time suggestions for existing Patient Names and Mobile Numbers to prevent duplicate entries.

### 🔍 **Search & History**
- **Old Record Lookup:** Instantly retrieve past patient details using **Name** or **Mobile Number**.
- **Show All:** A directory view of all unique patients with their total visit counts.
- **Visit History:** Drill down into specific dates to view past prescriptions and complaints.

### ⚡ **Efficiency Tools**
- **Repeat Visit (One-Click Save):** Clone an old record into a new visit with today's date—perfect for follow-ups with unchanged prescriptions.
- **Auto-Fill:** Automatically populates fields when an existing patient is selected.
- **Dynamic Inputs:** Text areas for "Chief Complaint" and "Medicine" expand automatically as you type.

### 💰 **Billing & Printing**
- **Auto-Calculation:** Automatically computes Grand Total based on Total, Cartage, and Conveyance.
- **Printable Bill:** Generates a professional, formatted HTML print view for prescriptions and receipts.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, CSS3 (Custom Flexbox/Grid layouts), Vanilla JS logic.
- **Backend:** Node.js, Express.js.
- **Database:** Microsoft SQL Server (MSSQL).
- **Hosting:** Render / Vercel (Recommended).

---

## 📂 Project Structure

```bash
Patient-Record-App/
├── backend/
│   ├── config/db.js         # MSSQL Database Connection
│   ├── controllers/         # Business Logic (Visits, Search, Auth)
│   ├── routes/              # API Route Definitions
│   └── server.js            # Entry Point
├── frontend/
│   ├── public/
│   │   └── app.js           # Core DOM Manipulation & Logic
│   ├── src/
│   │   ├── App.jsx          # Main Interface Component
│   │   ├── App.css          # Styling & Responsiveness
│   │   └── main.jsx         # React Entry
│   └── package.json
└── README.md
👨‍⚕️ Developed for Clinic Efficiency
This project focuses on reducing the time doctors spend on data entry, allowing them to focus more on patient care.
