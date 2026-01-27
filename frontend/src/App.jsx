import { useEffect } from "react";
import "./App.css";

function App() {

  // Load app.js ONCE (imperative logic)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/app.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="app">
      <div className="card">

        <header className="header">
          <h1>Patient Record</h1>
          <span className="date" id="headerDate"></span>
        </header>

        <form id="patientForm">

          {/* ================= BASIC INFO ================= */}
          <section className="section">
            <h2>Basic Information</h2>

            <div className="grid">
              <div className="field">
                <label>S.No</label>
                {/* UPDATED: Added right-align */}
                <input type="text" id="sno" placeholder="S.No" readOnly className="right-align" />
              </div>

              <div className="field">
                <label>Date</label>
                <input type="date" id="visitDate" />
              </div>

              <div className="field wide patient-name-field">
                <label>Patient Name</label>
                <div className="patient-name-row">
                  <input
                    type="text"
                    id="patientNameInput"
                    name="patientName"
                    placeholder="Enter patient name"
                    required
                  />
                  <button type="button" id="oldRecordBtn" className="nav-button">
                    OLD RECORD
                  </button>
                </div>
              </div>

              <div className="field">
                <label>Gender</label> {/* UPDATED: Changed Sex to Gender */}
                <select id="sex" required>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div className="field wide">
                <label>Father's Name</label>
                <input 
                  type="text" 
                  id="fatherNameInput" 
                  name="fatherName" 
                  placeholder="Enter father's name" 
                />
              </div>

              <div className="field">
                <label>Age</label>
                {/* UPDATED: Added min="0" and right-align */}
                <input type="number" id="age" required min="0" className="right-align" />
              </div>
            </div>
          </section>

          {/* ================= ADDRESS ================= */}
          <div className="section">
            <h3>Address</h3>
            <textarea id="address" className="address-box" required />
          </div>

          {/* ================= COMPLAINT / MEDICINE ================= */}
          <div className="section two-col">
            <div>
              <h3>Chief Complaint</h3>
              <textarea className="large-box" required />
            </div>
            <div>
              <h3>Medicine</h3>
              <textarea className="large-box" required />
            </div>
          </div>

          {/* ================= BILLING ================= */}
          <section className="section">
            <h2>Billing</h2>

            <div className="grid billing">
              <div className="field">
                <label>Total</label>
                {/* UPDATED: Added right-align */}
                <input type="number" id="total" defaultValue="0" className="right-align" />
              </div>

              <div className="field">
                <label>Cartage</label>
                {/* UPDATED: Added right-align */}
                <input type="number" id="cartage" defaultValue="0" className="right-align" />
              </div>

              <div className="field">
                <label>Conveyance</label>
                {/* UPDATED: Added right-align */}
                <input type="number" id="conveyance" defaultValue="0" className="right-align" />
              </div>

              <div className="field highlight">
                <label>Grand Total</label>
                {/* UPDATED: Added right-align */}
                <input type="number" id="grandTotal" defaultValue="0" readOnly className="right-align" />
              </div>
            </div>
          </section>

          {/* ================= FOOTER ================= */}
          <footer className="footer">
            {/* Left: Delete Button (Only visible in Edit Mode) */}
            <div>
               <button type="button" id="deleteBtn" className="danger hidden">Delete</button>
            </div>

            {/* Right: Action Buttons */}
            <div>
              <button type="button" id="cancelBtn">Cancel</button>
              <button type="submit" id="saveBtn" className="primary">Save</button>
              <button type="button" id="updateBtn" className="primary hidden">Update</button>
              <button type="button">Back</button>
            </div>
          </footer>

        </form>
      </div>

      {/* History Modal */}
      <div id="historyModal" className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Visit History</h3>
            <button type="button" className="close-modal" id="closeModalBtn">&times;</button>
          </div>
          <div className="modal-body">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>S.No</th>
                  <th>Father's Name</th>
                  <th>Grand Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="historyTableBody">
                {/* JS Injects Rows Here */}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;