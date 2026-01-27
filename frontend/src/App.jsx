import { useEffect } from "react";
import "./App.css";

function App() {
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
          <section className="section patient-data-box">
            
            {/* ROW 1: S.No | Date | Gender */}
            <div className="form-row">
              {/* S.No - Fixed Width Left */}
              <div className="input-group fixed-left">
                <label>S.No.</label>
                <input 
                  type="text" 
                  id="sno" 
                  readOnly 
                  className="right-align" 
                />
              </div>

              {/* Date - Centered / Flexible */}
              <div className="input-group col-date">
                <label>Date</label>
                <input type="date" id="visitDate" />
              </div>

              {/* Gender - Fixed Width Right (Aligns with Age) */}
              <div className="input-group fixed-right">
                <label>Gender</label>
                <select id="sex" required>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>

            {/* ROW 2: Patient Name | OLD Record | Age */}
            <div className="form-row">
              {/* Patient Name - Grows to fill space */}
              <div className="input-group grow">
                <label className="long-label">Patient's Name</label>
                <input
                  type="text"
                  id="patientNameInput"
                  name="patientName"
                  required
                />
              </div>
              
              {/* Old Record Button - Fixed Size */}
              <button type="button" id="oldRecordBtn" className="nav-button">
                OLD Record
              </button>

              {/* Age - Fixed Width Right (Aligns with Gender) */}
              <div className="input-group fixed-right">
                <label>Age</label>
                <input 
                  type="number" 
                  id="age" 
                  required 
                  min="0" 
                  className="right-align" 
                />
              </div>
            </div>

            {/* ROW 3: Father's Name */}
            <div className="form-row">
              <div className="input-group grow">
                <label className="long-label">Father's Name</label>
                <input 
                  type="text" 
                  id="fatherNameInput" 
                  name="fatherName" 
                />
              </div>
            </div>

            {/* ROW 4: Address */}
            <div className="form-row address-row">
              <label>Address</label>
              <textarea id="address" className="address-box" required />
            </div>

          </section>

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
                <input type="number" id="total" defaultValue="0" className="right-align" />
              </div>

              <div className="field">
                <label>Cartage</label>
                <input type="number" id="cartage" defaultValue="0" className="right-align" />
              </div>

              <div className="field">
                <label>Conveyance</label>
                <input type="number" id="conveyance" defaultValue="0" className="right-align" />
              </div>

              <div className="field highlight">
                <label>Grand Total</label>
                <input type="number" id="grandTotal" defaultValue="0" readOnly className="right-align" />
              </div>
            </div>
          </section>

          {/* ================= FOOTER ================= */}
          <footer className="footer">
            <div>
               <button type="button" id="deleteBtn" className="danger hidden">Delete</button>
            </div>
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
              <tbody id="historyTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;