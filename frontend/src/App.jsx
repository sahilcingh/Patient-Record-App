import { useEffect } from "react";
import "./styles.css";

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
                  <input 
  type="text" 
  id="sno" 
  placeholder="S.No"
/>
              </div>

              <div className="field">
                <label>Date</label>
                <input
                  type="date"
                  id="visitDate"
                />
              </div>

            
<div className="field wide patient-name-field">
  <label>Patient Name</label>
  <div className="patient-name-row">
    <input
      type="text"
      id="patientNameInput"  /* THIS ID MUST BE HERE */
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
                <label>Sex</label>
                <select required>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div className="field wide">
  <label>Father's Name</label>
  <input 
  type="text" 
  id="fName" // Add this
  name="fatherName" 
  placeholder="Enter father's name" 
/>
</div>

              <div className="field">
                <label>Age</label>
                <input type="number" required />
              </div>
            </div>
          </section>

          {/* ================= ADDRESS ================= */}
          <div className="section">
            <h3>Address</h3>
            <textarea
              className="address-box"
              required
            />
          </div>

          {/* ================= COMPLAINT / MEDICINE ================= */}
          <div className="section two-col">
            <div>
              <h3>Chief Complaint</h3>
              <textarea
                className="large-box"
                required
              />
            </div>
            <div>
              <h3>Medicine</h3>
              <textarea
                className="large-box"
                required
              />
            </div>
          </div>

          {/* ================= BILLING ================= */}
          <section className="section">
            <h2>Billing</h2>

            <div className="grid billing">
              <div className="field">
                <label>Total</label>
                <input
                  type="number"
                  id="total"
                  defaultValue="0"
                />
              </div>

              <div className="field">
                <label>Cartage</label>
                <input
                  type="number"
                  id="cartage"
                  defaultValue="0"
                />
              </div>

              <div className="field">
                <label>Conveyance</label>
                <input
                  type="number"
                  id="conveyance"
                  defaultValue="0"
                />
              </div>

              <div className="field highlight">
                <label>Grand Total</label>
                <input
                  type="number"
                  id="grandTotal"
                  defaultValue="0"
                  readOnly
                />
              </div>
            </div>
          </section>

          {/* ================= FOOTER ================= */}
          <footer className="footer">
            <button type="button" className="ghost">
              Show All
            </button>

            <div>
              <button type="reset">Cancel</button>
              <button type="submit" className="primary">
                Save
              </button>
              <button type="button">Back</button>
            </div>
          </footer>
          {/* History Modal */}
<div id="historyModal" className="modal-overlay" style={{ display: 'none' }}>
  <div className="modal-content">
    <div className="modal-header">
      <h3>Visit History</h3>
      <button type="button" onClick={() => document.getElementById('historyModal').style.display='none'}>&times;</button>
    </div>
    <div className="modal-body">
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>S.No</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="historyTableBody">
          {/* Rows will be injected here by app.js */}
        </tbody>
      </table>
    </div>
  </div>
</div>

        </form>
      </div>
    </div>
  );
}

export default App;
