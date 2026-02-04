🏥 Patient Record Management System
A comprehensive Full-Stack Web Application designed for medical clinics to manage patient visits, medical history, prescriptions, and billing efficiently. Built with React.js, Node.js, and Microsoft SQL Server.

🚀 Features
📝 Patient Management
Smart Entry: Record patient details (Name, Age, Gender, Mobile, Father's Name).

Validation: Strict input validation (e.g., Age ≤ 110, Mobile must be 10 digits).

Auto-Complete: Real-time suggestions for Patient Names and Mobile Numbers.

🔍 Search & History
Old Record Lookup: Instantly find past records by Name or Mobile Number.

Visit History: View a timeline of all previous visits for a specific patient.

Show All: A directory view of all unique patients with visit counts.

⚡ Smart Workflows
Auto-Fill: Automatically populates details for returning patients.

Save as New Record: One-click feature to clone an old record into a new visit with today's date (perfect for repeat visits with same meds).

Auto-Expanding Text Areas: Input boxes for "Complaint" and "Medicine" expand automatically as you type.

💰 Billing & Printing
Auto-Calculation: Automatically calculates Grand Total based on Total, Cartage, and Conveyance.

Clear-on-Focus: Billing fields auto-clear "0.00" when clicked for faster entry.

Professional Print: Generates a clean, formatted HTML print view for prescriptions and bills.

🎨 UI/UX
Custom Modals: Beautiful, custom-styled popups for Alerts, Confirmations, and Success messages (replacing default browser alerts).

Responsive Design: Works seamlessly on Desktop and Tablets.

🛠️ Tech Stack
Component ------------> Technology
Frontend -------------> React.js, CSS3 (Flexbox/Grid), Vanilla JS (DOM Logic)
Backend --------------> Node.js, Express.js
Database -------------> Microsoft SQL Server (MSSQL)
Hosting --------------> Render (Backend/Frontend) / Vercel


📂 Project Structure
Patient-Record-App/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Logic for Visits (CRUD, Search, Auth)
│   ├── routes/          # API Routes definitions
│   └── server.js        # Entry point
├── frontend/
│   ├── public/
│   │   └── app.js       # Core frontend logic & DOM manipulation
│   ├── src/
│   │   ├── App.jsx      # Main React Layout
│   │   ├── App.css      # Styling & Responsiveness
│   │   └── main.jsx     # React DOM root
│   └── package.json
└── README.md

👨‍⚕️ Developed for Clinic Efficiency
This project focuses on reducing the time doctors spend on data entry, allowing them to focus more on patient care.
