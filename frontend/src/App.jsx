import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/app.js";
    script.defer = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <div className="app">
      <div className="card">
        <header className="header">
          <h1>Patient Record</h1>
          <span className="date" id="headerDate"></span>
        </header>

        <form id="patientForm">
          {/* BASIC INFO */}
          <section className="section patient-data-box">
            <div className="form-row">
              <div className="input-group fixed-left">
                <label className="aligned-label">S.No.</label>
                <input type="text" id="sno" readOnly className="right-align" style={{width: "60px"}} />
              </div>
              <div className="input-group col-date">
                <label>Date</label>
                <input type="date" id="visitDate" />
              </div>
              <div className="input-group fixed-right">
                <label>Gender</label>
                <select id="sex" required>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group grow">
                <label className="aligned-label">Patient's Name</label>
                <div className="autocomplete-wrapper">
                    <input type="text" id="patientNameInput" name="patientName" autoComplete="off" required />
                    <ul id="suggestionsList" className="suggestions-list hidden"></ul>
                </div>
              </div>
              
              <button type="button" id="oldRecordBtn" className="nav-button">OLD Record</button>

              <div className="input-group fixed-right">
                <label>Age</label>
                <input type="text" inputMode="numeric" id="age" required className="right-align" maxLength="3" placeholder="0" />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group grow">
                <label className="aligned-label">Father's Name</label>
                <input type="text" id="fatherNameInput" name="fatherName" required />
              </div>
              
              <div className="input-group fixed-mobile">
                <label>Mobile</label>
                <div className="autocomplete-wrapper">
                    <input type="text" inputMode="numeric" id="mobileInput" autoComplete="off" className="right-align" maxLength="10" />
                    <ul id="mobileSuggestionsList" className="suggestions-list hidden"></ul>
                </div>
              </div>
            </div>

            <div className="form-row address-row">
              <div className="input-group grow align-top">
                <label className="aligned-label" style={{marginTop: "8px"}}>Address</label>
                <textarea id="address" className="address-box" required />
              </div>
            </div>
          </section>

          {/* COMPLAINT / MEDICINE (Back to 2 Columns) */}
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

          {/* BILLING */}
          <section className="section billing-section">
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

          {/* FOOTER */}
          <footer className="footer">
            {/* LEFT SIDE */}
            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
               <button 
                    type="button" 
                    id="showAllBtn" 
                    className="nav-button" 
                    style={{ background: "linear-gradient(to bottom, #17a2b8, #138496)", border: "1px solid #117a8b", margin: 0 }}
                >
                    Show All
                </button>
               <button type="button" id="deleteBtn" className="danger hidden">Delete</button>
            </div>

            {/* RIGHT SIDE */}
            <div>
              {/* NEW TESTS BUTTON */}
              <button 
                type="button" 
                id="openTestsBtn" 
                style={{
                    background: "linear-gradient(to bottom, #fd7e14, #e36d0d)", 
                    color: "white", 
                    border: "1px solid #d66408"
                }}
              >
                Tests/Inv.
              </button>

              <button type="button" id="printBtn" style={{background: "#6c757d", color: "white", border: "1px solid #5a6268"}}>Print Bill</button>
              <button type="button" id="cancelBtn">Cancel</button>
              <button 
                type="button" 
                id="saveAsNewBtn" 
                className="hidden" 
                style={{
                    background: "linear-gradient(to bottom, #17a2b8, #138496)", 
                    color: "white", 
                    border: "1px solid #117a8b"
                }}
              >
                Save as New Record
              </button>
              <button type="button" id="saveBtn" className="primary">Save</button>
              <button type="button" id="updateBtn" className="primary hidden">Update</button>
            </div>
          </footer>
        </form>
      </div>

      {/* --- MODALS --- */}

      {/* 1. History Modal */}
      <div id="historyModal" className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3 id="modalTitleText">Records</h3>
            <button type="button" className="close-modal" id="closeModalBtn">&times;</button>
          </div>
          <div className="modal-body">
            <div className="table-container">
                <table className="history-table">
                <thead id="historyTableHead"></thead>
                <tbody id="historyTableBody"></tbody>
                </table>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TESTS / INV MODAL (New) */}
      <div id="testsModal" className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Tests / Investigation</h3>
            <button type="button" className="close-modal" id="closeTestsModalBtn">&times;</button>
          </div>
          <div className="modal-body">
            <p style={{marginBottom: "10px", color: "#666", fontSize: "0.9rem"}}>Enter tests or investigations below:</p>
            <textarea id="testsBox" className="large-box" style={{height: "150px"}} placeholder="e.g. Blood Test, X-Ray..."></textarea>
            
            <div className="tests-modal-actions">
                <button type="button" id="testDeleteBtn" className="delete-btn">Delete</button>
                <button type="button" id="testCancelBtn" className="cancel-btn">Cancel</button>
                <button type="button" id="testUpdateBtn" className="update-btn">Update</button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Alert Modal */}
      <div id="customModal" className="modal-overlay" style={{zIndex: 3000, display: 'none'}}>
        <div className="modal-content confirm-box">
          <div className="confirm-icon" id="modalIcon">⚠️</div>
          <h2 id="modalTitle">Alert</h2>
          <p id="modalMessage">Something went wrong.</p>
          <div className="confirm-actions">
            <button type="button" id="modalCancelBtn" className="cancel-btn">Cancel</button>
            <button type="button" id="modalOkBtn" className="primary-btn">OK</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;