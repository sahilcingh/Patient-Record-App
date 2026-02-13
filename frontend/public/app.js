// (function initPatientForm() {
//     const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
//     const API_BASE_URL = isLocal 
//         ? "http://localhost:5000" 
//         : "https://patient-record-app-drly.onrender.com"; 

//     const getEl = (id) => document.getElementById(id);

//     async function startApp() {
//         const form = getEl("patientForm");
//         if (!form) { setTimeout(startApp, 100); return; }
//         if (form.dataset.initialized === "true") return;
//         form.dataset.initialized = "true";

//         // Elements
//         const snoInput = getEl("sno");
//         const ageInput = getEl("age"); 
//         const sexInput = getEl("sex");
//         const mobileInput = getEl("mobileInput");
//         const total = getEl("total");
//         const cartage = getEl("cartage");
//         const conveyance = getEl("conveyance");
//         const grandTotal = getEl("grandTotal");
//         const visitDate = getEl("visitDate");
//         const billingFields = [total, cartage, conveyance].filter(Boolean);

//         const patientNameInput = getEl("patientNameInput");
//         const fatherNameInput = getEl("fatherNameInput");
//         const suggestionsList = getEl("suggestionsList");
//         const mobileSuggestionsList = getEl("mobileSuggestionsList");

//         const saveBtn = form.querySelector('#saveBtn');
//         const updateBtn = form.querySelector('#updateBtn'); 
//         const deleteBtn = form.querySelector('#deleteBtn'); 
//         const cancelBtn = form.querySelector('#cancelBtn'); 
//         const saveAsNewBtn = form.querySelector('#saveAsNewBtn'); 
//         const oldRecordBtn = getEl("oldRecordBtn");
//         const showAllBtn = getEl("showAllBtn"); // NEW BUTTON
//         const printBtn = getEl("printBtn"); 

//         const historyModal = getEl("historyModal");
//         const tableBody = getEl("historyTableBody");
//         const tableHead = getEl("historyTableHead");
//         const modalTitleText = getEl("modalTitleText");
//         const closeModalBtn = getEl("closeModalBtn");

//         const customModal = getEl("customModal");
//         const modalIcon = getEl("modalIcon");
//         const modalTitle = getEl("modalTitle");
//         const modalMessage = getEl("modalMessage");
//         const modalOkBtn = getEl("modalOkBtn");
//         const modalCancelBtn = getEl("modalCancelBtn");

//         const addressBox = form.querySelector(".address-box");
//         const complaintBox = form.querySelectorAll(".large-box")[0];
//         const medicineBox = form.querySelectorAll(".large-box")[1];

//         let currentModalCallback = null; 

//         // Check Old Record Button
//         function checkOldRecordButton() {
//             const hasName = patientNameInput.value.trim().length > 0;
//             const hasMobile = mobileInput.value.trim().length === 10;
//             if (hasName || hasMobile) {
//                 oldRecordBtn.disabled = false;
//                 oldRecordBtn.style.opacity = "1";
//                 oldRecordBtn.style.cursor = "pointer";
//             } else {
//                 oldRecordBtn.disabled = true;
//                 oldRecordBtn.style.opacity = "0.5";
//                 oldRecordBtn.style.cursor = "not-allowed";
//             }
//         }
//         patientNameInput.addEventListener("input", checkOldRecordButton);
//         mobileInput.addEventListener("input", checkOldRecordButton);
//         checkOldRecordButton(); 

//         /* ================= SMART POPUP SYSTEM ================= */
//         function showModal(type, title, message, onOk = null) {
//             modalTitle.textContent = title;
//             modalMessage.textContent = message;
//             currentModalCallback = onOk;
//             modalOkBtn.className = "primary-btn";
//             modalOkBtn.style.background = ""; 

//             if (type === 'alert') {
//                 modalIcon.textContent = "⚠️";
//                 modalCancelBtn.style.display = "none"; 
//                 modalOkBtn.textContent = "OK";
//             } else if (type === 'confirm') {
//                 modalIcon.textContent = "💾";
//                 modalCancelBtn.style.display = "block";
//                 modalOkBtn.textContent = "Yes, Save";
//             } else if (type === 'delete') {
//                 modalIcon.textContent = "🗑️";
//                 modalCancelBtn.style.display = "block";
//                 modalOkBtn.textContent = "Delete";
//                 modalOkBtn.style.background = "linear-gradient(135deg, #dc3545, #c82333)";
//             } else if (type === 'success') {
//                 modalIcon.textContent = "✅";
//                 modalCancelBtn.style.display = "none";
//                 modalOkBtn.textContent = "Great";
//             }
//             customModal.style.display = "flex";
//         }

//         modalCancelBtn.addEventListener("click", () => { customModal.style.display = "none"; currentModalCallback = null; });
//         modalOkBtn.addEventListener("click", () => { customModal.style.display = "none"; if (currentModalCallback) currentModalCallback(); currentModalCallback = null; });

//         /* ================= BILLING LOGIC ================= */
//         function setupBillingField(input) {
//             input.addEventListener("focus", function() {
//                 if (this.value === "0" || this.value === "0.00") { this.value = ""; }
//             });
//             input.addEventListener("blur", function() {
//                 if (this.value.trim() === "" || isNaN(parseFloat(this.value))) { this.value = "0.00"; } 
//                 else { this.value = parseFloat(this.value).toFixed(2); }
//                 calculateGrandTotal();
//             });
//             input.addEventListener("input", function() { calculateGrandTotal(); });
//         }
//         billingFields.forEach(field => setupBillingField(field));

//         function calculateGrandTotal() {
//             const t = parseFloat(total?.value) || 0;
//             const c = parseFloat(cartage?.value) || 0;
//             const v = parseFloat(conveyance?.value) || 0;
//             if (grandTotal) grandTotal.value = (t + c + v).toFixed(2);
//         }

//         /* ================= AUTO-EXPAND ================= */
//         function adjustTextareaHeight(el) {
//             if (!el) return;
//             el.style.height = "auto";
//             el.style.height = (el.scrollHeight + 5) + "px";
//         }
//         [addressBox, complaintBox, medicineBox].forEach(box => {
//             if(box) {
//                 box.addEventListener("input", () => adjustTextareaHeight(box));
//                 box.addEventListener("focus", () => adjustTextareaHeight(box));
//                 box.addEventListener("blur", () => setTimeout(() => adjustTextareaHeight(box), 10));
//             }
//         });

//         /* ================= INPUT RESTRICTIONS ================= */
//         if (ageInput) {
//             ageInput.addEventListener("input", function() {
//                 let val = this.value.replace(/[^0-9]/g, '');
//                 if (val.length > 3) val = val.slice(0, 3);
//                 if (parseInt(val) > 110) val = "110";
//                 this.value = val;
//             });
//         }

//         if (mobileInput) {
//             mobileInput.addEventListener("input", async function() {
//                 this.value = this.value.replace(/[^0-9]/g, '');
//                 if (this.value.length > 10) this.value = this.value.slice(0, 10);
//                 checkOldRecordButton(); 

//                 const query = this.value.trim();
//                 if (query.length < 2) { mobileSuggestionsList.classList.add("hidden"); return; }
                
//                 try {
//                     const res = await fetch(`${API_BASE_URL}/api/visits/mobile-suggestions?query=${encodeURIComponent(query)}`);
//                     const results = await res.json();
//                     mobileSuggestionsList.innerHTML = "";
//                     if (results.length > 0) {
//                         results.forEach(item => {
//                             const li = document.createElement("li");
//                             li.textContent = `${item.B_Mobile} - ${item.B_PName}`; 
//                             li.onclick = async () => {
//                                 mobileInput.value = item.B_Mobile; 
//                                 mobileSuggestionsList.classList.add("hidden"); 
//                                 checkOldRecordButton();
//                                 try {
//                                     const searchRes = await fetch(`${API_BASE_URL}/api/visits/search?mobile=${encodeURIComponent(item.B_Mobile)}`);
//                                     const searchData = await searchRes.json();
//                                     if(searchData.records && searchData.records.length > 0) {
//                                         autoFillPatientDetails(searchData.records[0]);
//                                     }
//                                 } catch(e) { console.error(e); }
//                             };
//                             mobileSuggestionsList.appendChild(li);
//                         });
//                         mobileSuggestionsList.classList.remove("hidden");
//                     } else { mobileSuggestionsList.classList.add("hidden"); }
//                 } catch (err) { console.error(err); }
//             });
//             document.addEventListener("click", function(e) { if (e.target !== mobileInput) mobileSuggestionsList.classList.add("hidden"); });
//         }

//         /* ================= NAME AUTOCOMPLETE ================= */
//         if (patientNameInput && suggestionsList) {
//             patientNameInput.addEventListener("input", async function() {
//                 checkOldRecordButton();
//                 const query = this.value.trim();
//                 if (query.length < 1) { suggestionsList.classList.add("hidden"); return; }
//                 try {
//                     const res = await fetch(`${API_BASE_URL}/api/visits/suggestions?query=${encodeURIComponent(query)}`);
//                     const names = await res.json();
//                     suggestionsList.innerHTML = "";
//                     if (names.length > 0) {
//                         names.forEach(item => {
//                             const li = document.createElement("li");
//                             li.textContent = item.B_PName;
//                             li.onclick = async () => {
//                                 patientNameInput.value = item.B_PName; 
//                                 suggestionsList.classList.add("hidden"); 
//                                 checkOldRecordButton();
//                                 try {
//                                     const searchRes = await fetch(`${API_BASE_URL}/api/visits/search?name=${encodeURIComponent(item.B_PName)}`);
//                                     const searchData = await searchRes.json();
//                                     if(searchData.records && searchData.records.length > 0) {
//                                         autoFillPatientDetails(searchData.records[0]);
//                                     }
//                                 } catch(e) { console.error(e); }
//                             };
//                             suggestionsList.appendChild(li);
//                         });
//                         suggestionsList.classList.remove("hidden");
//                     } else { suggestionsList.classList.add("hidden"); }
//                 } catch (err) { console.error(err); }
//             });
//             document.addEventListener("click", function(e) { if (e.target !== patientNameInput) suggestionsList.classList.add("hidden"); });
//         }

//         /* ================= AUTO-FILL & TOGGLE ================= */
//         function autoFillPatientDetails(record) {
//             patientNameInput.value = record.B_PName || "";
//             fatherNameInput.value = record.B_FName || "";
//             if(sexInput) sexInput.value = record.B_Sex || "";
//             if(ageInput) ageInput.value = record.B_Age || "";
//             if(mobileInput) mobileInput.value = record.B_Mobile || ""; 
//             if(addressBox) { addressBox.value = record.B_To || ""; setTimeout(() => adjustTextareaHeight(addressBox), 50); }

//             if(complaintBox) { complaintBox.value = ""; adjustTextareaHeight(complaintBox); }
//             if(medicineBox) { medicineBox.value = ""; adjustTextareaHeight(medicineBox); }
//             if(total) total.value = "0.00";
//             if(cartage) cartage.value = "0.00";
//             if(conveyance) conveyance.value = "0.00";
//             if(grandTotal) grandTotal.value = "0.00";

//             checkOldRecordButton();
//         }

//         function toggleEditMode(enable) {
//             isEditMode = enable;
//             if (enable) {
//                 saveBtn.classList.add("hidden");
//                 updateBtn.classList.remove("hidden");
//                 deleteBtn.classList.remove("hidden");
//                 saveAsNewBtn.classList.remove("hidden"); 
//                 snoInput.style.backgroundColor = "#e0e0e0"; 
//             } else {
//                 saveBtn.classList.remove("hidden");
//                 updateBtn.classList.add("hidden");
//                 deleteBtn.classList.add("hidden");
//                 saveAsNewBtn.classList.add("hidden"); 
//                 snoInput.style.backgroundColor = "white";
//             }
//         }

//         function validateForm() { 
//             if (!patientNameInput.value.trim()) { showModal('alert', 'Missing Name', 'Please enter the Patient Name.'); patientNameInput.focus(); return false; } 
//             if (!fatherNameInput.value.trim()) { showModal('alert', 'Missing Father Name', 'Please enter Father\'s Name.'); fatherNameInput.focus(); return false; }
//             if (!sexInput.value || sexInput.value === "Select") { showModal('alert', 'Missing Gender', 'Please select a Gender.'); sexInput.focus(); return false; }
//             if (!ageInput.value || parseInt(ageInput.value) <= 0) { showModal('alert', 'Invalid Age', 'Please enter a valid Age.'); ageInput.focus(); return false; }
            
//             const mobileVal = mobileInput.value.trim();
//             if (mobileVal.length > 0 && mobileVal.length !== 10) { 
//                 showModal('alert', 'Invalid Mobile', 'Mobile Number must be exactly 10 digits (or leave empty).'); 
//                 mobileInput.focus(); return false; 
//             }

//             if (!addressBox.value.trim()) { showModal('alert', 'Missing Address', 'Please enter the Address.'); addressBox.focus(); return false; }
//             if (!complaintBox.value.trim()) { showModal('alert', 'Missing Complaint', 'Please enter the Chief Complaint.'); complaintBox.focus(); return false; }
//             if (!medicineBox.value.trim()) { showModal('alert', 'Missing Medicine', 'Please enter the Medicine.'); medicineBox.focus(); return false; }
//             if (!grandTotal.value.trim() || parseFloat(grandTotal.value) < 0) { showModal('alert', 'Missing Billing', 'Billing details are incomplete.'); grandTotal.focus(); return false; }

//             return true; 
//         }

//         /* ================= CRUD ================= */
//         if (saveBtn) {
//             saveBtn.addEventListener("click", (e) => {
//                 e.preventDefault();
//                 if (!validateForm()) return;
//                 showModal('confirm', 'Confirm Save', 'Are you sure you want to save this record?', async () => {
//                     saveBtn.disabled = true; saveBtn.innerText = "Saving...";
//                     try {
//                         const res = await fetch(`${API_BASE_URL}/api/visits`, {
//                             method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(getPayload())
//                         });
//                         if (res.ok) { showModal('success', 'Saved', 'Record Saved Successfully!'); resetForm(); } 
//                         else { showModal('alert', 'Error', 'Failed to save record.'); }
//                     } catch (err) { showModal('alert', 'Error', 'Server Error.'); } 
//                     finally { saveBtn.disabled = false; saveBtn.innerText = "Save"; }
//                 });
//             });
//         }

//         if (updateBtn) {
//             updateBtn.addEventListener("click", (e) => {
//                 e.preventDefault();
//                 if (!validateForm()) return;
//                 showModal('confirm', 'Confirm Update', 'Are you sure you want to update this record?', async () => {
//                     updateBtn.disabled = true; updateBtn.innerText = "Updating...";
//                     try {
//                         const res = await fetch(`${API_BASE_URL}/api/visits/${snoInput.value}`, {
//                             method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(getPayload())
//                         });
//                         if (res.ok) { showModal('success', 'Updated', 'Record Updated Successfully!'); resetForm(); } 
//                         else { showModal('alert', 'Error', 'Update failed.'); }
//                     } catch (err) { showModal('alert', 'Error', 'Server Error.'); } 
//                     finally { updateBtn.disabled = false; updateBtn.innerText = "Update"; }
//                 });
//             });
//         }

//         if (deleteBtn) {
//             deleteBtn.addEventListener("click", (e) => {
//                 e.preventDefault();
//                 showModal('delete', 'Confirm Delete', `Delete record #${snoInput.value}?`, async () => {
//                     deleteBtn.disabled = true; deleteBtn.innerText = "Deleting...";
//                     try {
//                         const res = await fetch(`${API_BASE_URL}/api/visits/${snoInput.value}`, { method: "DELETE" });
//                         if (res.ok) { showModal('success', 'Deleted', 'Record Deleted Successfully.'); resetForm(); } 
//                         else { showModal('alert', 'Error', 'Delete failed.'); }
//                     } catch (err) { showModal('alert', 'Error', 'Server Error.'); } 
//                     finally { deleteBtn.disabled = false; deleteBtn.innerText = "Delete"; }
//                 });
//             });
//         }

//         if (saveAsNewBtn) {
//             saveAsNewBtn.addEventListener("click", (e) => {
//                 e.preventDefault();
//                 if (!validateForm()) return;

//                 showModal('confirm', 'Save as New Record', 'Create a NEW visit with today\'s date using these details?', async () => {
//                     saveAsNewBtn.disabled = true; saveAsNewBtn.innerText = "Saving...";
//                     const payload = getPayload();
//                     const now = new Date();
//                     payload.date = now.toISOString().split('T')[0];

//                     try {
//                         const res = await fetch(`${API_BASE_URL}/api/visits`, {
//                             method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
//                         });
//                         if (res.ok) { showModal('success', 'Created', 'New Visit Created Successfully!'); resetForm(); } 
//                         else { showModal('alert', 'Error', 'Failed to create record.'); }
//                     } catch (err) { showModal('alert', 'Error', 'Server Error.'); } 
//                     finally { saveAsNewBtn.disabled = false; saveAsNewBtn.innerText = "Save as New Record"; }
//                 });
//             });
//         }

//         if (printBtn) {
//             printBtn.addEventListener("click", () => {
//                 if (!validateForm()) return;
//                 const name = patientNameInput.value.trim();
//                 const date = visitDate.value || new Date().toISOString().split('T')[0];
//                 const printWindow = window.open('', '', 'height=600,width=800');
//                 printWindow.document.write('<html><head><title>Print Bill</title><style>body{font-family:Arial,sans-serif;padding:20px;-webkit-print-color-adjust:exact}.print-header{background-color:#ffff00;color:#ff0000;text-align:center;padding:15px;margin-bottom:20px;border:1px solid #ddd}.clinic-name{font-size:22px;font-weight:bold;text-transform:uppercase;margin-bottom:5px;letter-spacing:1px}.dr-name{font-size:32px;font-weight:900;text-transform:uppercase;margin-bottom:5px}.designation{font-size:16px;font-weight:bold;margin-bottom:2px}.address-line{color:#000;font-size:12px;margin-top:10px;font-weight:normal}.receipt-title{text-align:center;margin:10px 0 20px 0;font-size:18px;font-weight:bold;text-transform:uppercase;border-bottom:2px solid #333;display:inline-block;padding-bottom:5px}.title-container{text-align:center}.info-grid{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;border:1px solid #333;padding:10px;font-weight:bold}.section-title{font-weight:bold;margin-top:10px;background:#eee;padding:5px;border-left:5px solid #ff0000}.content-box{border:1px solid #ccc;padding:10px;min-height:50px;margin-bottom:10px;white-space:pre-wrap;font-size:14px}.billing-table{width:100%;border-collapse:collapse;margin-top:15px}.billing-table th,.billing-table td{border:1px solid #000;padding:8px;text-align:left}.total-row{font-weight:bold;background-color:#f0f0f0}</style></head><body>');
//                 printWindow.document.write('<div class="print-header"><div class="clinic-name">S.S. HOMOEO CARE CLINIC</div><div class="dr-name">DR. S.S. GUPTA</div><div class="designation">M.D. (Homoeo)</div><div class="designation">Psychiatrist</div><div class="address-line">Address: Your Clinic Address Here | Phone: 9999999999</div></div>');
//                 printWindow.document.write('<div class="title-container"><div class="receipt-title">Patient Receipt</div></div>');
//                 printWindow.document.write(`<div class="info-grid"><div>NAME: ${name.toUpperCase()}</div><div>DATE: ${date}</div></div>`);
//                 printWindow.document.write(`<div class="section-title">Chief Complaint</div><div class="content-box">${complaintBox.value}</div>`);
//                 printWindow.document.write(`<div class="section-title">Medicine</div><div class="content-box">${medicineBox.value}</div>`);
//                 printWindow.document.write(`<div class="section-title">Billing Details</div><table class="billing-table"><tr><td>Total</td><td>${total.value||'0.00'}</td></tr><tr><td>Cartage</td><td>${cartage.value||'0.00'}</td></tr><tr><td>Conveyance</td><td>${conveyance.value||'0.00'}</td></tr><tr class="total-row"><td>Grand Total</td><td>${grandTotal.value}</td></tr></table>`);
//                 printWindow.document.write('</body></html>');
//                 printWindow.document.close();
//                 setTimeout(() => { printWindow.print(); }, 500);
//             });
//         }

//         /* ================= 10. SHOW ALL + OLD RECORD NAVIGATION ================= */
//         // Function to render patient list in modal
//         function renderPatientList(records) {
//             modalTitleText.textContent = "All Patients";
//             tableHead.innerHTML = `<tr><th>Patient Name</th><th>Father's Name</th><th>Mobile</th><th>Total Visits</th></tr>`;
//             tableBody.innerHTML = "";
            
//             if (records.length === 0) {
//                 tableBody.innerHTML = "<tr><td colspan='4'>No patients found.</td></tr>";
//                 return;
//             }

//             records.forEach(rec => {
//                 const row = document.createElement("tr");
//                 row.innerHTML = `
//                     <td style="font-weight:bold; color:#0056b3;">${rec.B_PName}</td>
//                     <td>${rec.B_FName || '-'}</td>
//                     <td>${rec.B_Mobile || '-'}</td>
//                     <td>${rec.VisitCount}</td>
//                 `;
//                 // ON CLICK: Drill down to visits for this patient
//                 row.onclick = () => loadVisitsForPatient(rec.B_PName, rec.B_Mobile);
//                 tableBody.appendChild(row);
//             });
//             historyModal.style.display = "flex";
//         }

//         // Function to fetch and render visits for a specific patient
//         async function loadVisitsForPatient(name, mobile) {
//             let queryParam = "";
//             if (mobile && mobile.length === 10) { queryParam = `mobile=${encodeURIComponent(mobile)}`; } 
//             else if (name) { queryParam = `name=${encodeURIComponent(name)}`; }

//             try {
//                 const res = await fetch(`${API_BASE_URL}/api/visits/search?${queryParam}`);
//                 const data = await res.json();
                
//                 modalTitleText.textContent = `Visits for: ${name}`;
//                 tableHead.innerHTML = `<tr><th>Date</th><th>Patient Name</th><th>Father's Name</th><th>Grand Total</th></tr>`;
//                 tableBody.innerHTML = "";

//                 if (data.records.length === 0) {
//                     tableBody.innerHTML = "<tr><td colspan='4'>No visits found.</td></tr>";
//                     return;
//                 }

//                 data.records.forEach(rec => {
//                     const date = new Date(rec.B_Date).toLocaleDateString('en-GB'); 
//                     const row = document.createElement("tr");
//                     row.innerHTML = `<td>${date}</td><td>${rec.B_PName}</td><td>${rec.B_FName || '-'}</td><td>${rec.B_TotalAmt || 0}</td>`;
                    
//                     // ON CLICK: Load record into form
//                     row.onclick = () => { 
//                         fillForm(rec); 
//                         toggleEditMode(true); 
//                         historyModal.style.display = "none"; 
//                     };
//                     tableBody.appendChild(row);
//                 });
//             } catch (err) { showModal('alert', 'Error', 'Could not load visits.'); }
//         }

//         // SHOW ALL BUTTON CLICK
//         if (showAllBtn) {
//             showAllBtn.addEventListener("click", async () => {
//                 try {
//                     const res = await fetch(`${API_BASE_URL}/api/visits/all-patients`);
//                     const records = await res.json();
//                     renderPatientList(records);
//                 } catch (err) { showModal('alert', 'Error', 'Error fetching patients list.'); }
//             });
//         }

//         // OLD RECORD BUTTON CLICK (Reused Logic)
//         if (oldRecordBtn) {
//             oldRecordBtn.addEventListener("click", async () => {
//                 const name = patientNameInput.value.trim();
//                 const mobile = mobileInput.value.trim();

//                 if (!name && mobile.length !== 10) {
//                     showModal('alert', 'Missing Information', 'Please enter a valid Name or Mobile Number.');
//                     return;
//                 }
//                 // Directly load visits (skip patient list since we are searching for specific person)
//                 loadVisitsForPatient(name, mobile);
//                 historyModal.style.display = "flex";
//             });
//         }

//         /* ================= HELPER FUNCTIONS ================= */
//         function getPayload() {
//             return {
//                 date: visitDate.value,
//                 patientName: getEl("patientNameInput").value,
//                 sex: sexInput.value,
//                 fatherName: getEl("fatherNameInput").value,
//                 mobile: mobileInput ? mobileInput.value : "",
//                 age: (getEl("age") || form.querySelector("#age")).value,
//                 address: (getEl("address") || form.querySelector(".address-box")).value,
//                 chiefComplaint: complaintBox.value,
//                 medicine: medicineBox.value,
//                 total: total.value,
//                 cartage: cartage.value,
//                 conveyance: conveyance.value,
//                 grandTotal: grandTotal.value
//             };
//         }

//         function fillForm(record) {
//             patientNameInput.value = record.B_PName || "";
//             fatherNameInput.value = record.B_FName || "";
//             if(sexInput) sexInput.value = record.B_Sex || "";
//             if(ageInput) ageInput.value = record.B_Age || "";
//             if(mobileInput && record.B_Mobile) mobileInput.value = record.B_Mobile; 
//             if(addressBox) addressBox.value = record.B_To || "";
//             if(complaintBox) complaintBox.value = record.B_Perticu1 || "";
//             if(medicineBox) medicineBox.value = record.B_Perticu2 || "";
//             setTimeout(() => { adjustTextareaHeight(addressBox); adjustTextareaHeight(complaintBox); adjustTextareaHeight(medicineBox); }, 50);
//             snoInput.value = record.B_Sno || "";
//             if (visitDate && record.B_Date) visitDate.value = new Date(record.B_Date).toISOString().split('T')[0];
//             total.value = (record.B_PerticuAmt1 || 0).toFixed(2);
//             cartage.value = (record.B_Cart || 0).toFixed(2);
//             conveyance.value = (record.B_Conv || 0).toFixed(2);
//             grandTotal.value = (record.B_TotalAmt || 0).toFixed(2);
//             checkOldRecordButton();
//         }
        
//         function resetForm() {
//             form.reset();
//             billingFields.forEach(f => f.value = "0.00");
//             grandTotal.value = "0.00";
//             if(addressBox) addressBox.style.height = "auto";
//             if(complaintBox) complaintBox.style.height = "auto";
//             if(medicineBox) medicineBox.style.height = "auto";
//             toggleEditMode(false);
//             loadNextSno();
//             visitDate.value = new Date().toISOString().split('T')[0];
//             checkOldRecordButton();
//         }

//         async function loadNextSno() {
//             try { const res = await fetch(`${API_BASE_URL}/api/visits/next-sno`); const data = await res.json(); if (res.ok) snoInput.value = data.nextSno; } catch (err) { console.error(err); }
//         }

//         loadNextSno(); 
//         if(visitDate) visitDate.value = new Date().toISOString().split('T')[0];
//         if (cancelBtn) cancelBtn.addEventListener("click", resetForm);
//         if (closeModalBtn) closeModalBtn.onclick = () => { historyModal.style.display = "none"; };
//     }
//     startApp();
// })();


(function initPatientForm() {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const API_BASE_URL = isLocal 
        ? "http://localhost:5000" 
        : "https://patient-record-app-drly.onrender.com"; 

    const getEl = (id) => document.getElementById(id);

    async function startApp() {
        const form = getEl("patientForm");
        if (!form) { setTimeout(startApp, 100); return; }
        if (form.dataset.initialized === "true") return;
        form.dataset.initialized = "true";

        // Elements
        const snoInput = getEl("sno");
        const ageInput = getEl("age"); 
        const sexInput = getEl("sex");
        const mobileInput = getEl("mobileInput");
        const total = getEl("total");
        const cartage = getEl("cartage");
        const conveyance = getEl("conveyance");
        const grandTotal = getEl("grandTotal");
        const visitDate = getEl("visitDate");
        const billingFields = [total, cartage, conveyance].filter(Boolean);

        const patientNameInput = getEl("patientNameInput");
        const fatherNameInput = getEl("fatherNameInput");
        const suggestionsList = getEl("suggestionsList");
        const mobileSuggestionsList = getEl("mobileSuggestionsList");

        const saveBtn = form.querySelector('#saveBtn');
        const updateBtn = form.querySelector('#updateBtn'); 
        const deleteBtn = form.querySelector('#deleteBtn'); 
        const cancelBtn = form.querySelector('#cancelBtn'); 
        const saveAsNewBtn = form.querySelector('#saveAsNewBtn'); 
        const oldRecordBtn = getEl("oldRecordBtn");
        const showAllBtn = getEl("showAllBtn"); 
        const printBtn = getEl("printBtn"); 

        const historyModal = getEl("historyModal");
        const tableBody = getEl("historyTableBody");
        const tableHead = getEl("historyTableHead");
        const modalTitleText = getEl("modalTitleText");
        const closeModalBtn = getEl("closeModalBtn");

        const customModal = getEl("customModal");
        const modalIcon = getEl("modalIcon");
        const modalTitle = getEl("modalTitle");
        const modalMessage = getEl("modalMessage");
        const modalOkBtn = getEl("modalOkBtn");
        const modalCancelBtn = getEl("modalCancelBtn");

        const addressBox = form.querySelector(".address-box");
        // UPDATED: Now we have 3 large-boxes (Complaint, Tests, Medicine)
        const largeBoxes = form.querySelectorAll(".large-box");
        const complaintBox = largeBoxes[0];
        const testsBox = largeBoxes[1]; // The new Tests field
        const medicineBox = largeBoxes[2];

        let currentModalCallback = null; 

        // Check Old Record Button
        function checkOldRecordButton() {
            const hasName = patientNameInput.value.trim().length > 0;
            const hasMobile = mobileInput.value.trim().length === 10;
            if (hasName || hasMobile) {
                oldRecordBtn.disabled = false;
                oldRecordBtn.style.opacity = "1";
                oldRecordBtn.style.cursor = "pointer";
            } else {
                oldRecordBtn.disabled = true;
                oldRecordBtn.style.opacity = "0.5";
                oldRecordBtn.style.cursor = "not-allowed";
            }
        }
        patientNameInput.addEventListener("input", checkOldRecordButton);
        mobileInput.addEventListener("input", checkOldRecordButton);
        checkOldRecordButton(); 

        /* ================= SMART POPUP SYSTEM ================= */
        function showModal(type, title, message, onOk = null) {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            currentModalCallback = onOk;
            modalOkBtn.className = "primary-btn";
            modalOkBtn.style.background = ""; 

            if (type === 'alert') {
                modalIcon.textContent = "⚠️";
                modalCancelBtn.style.display = "none"; 
                modalOkBtn.textContent = "OK";
            } else if (type === 'confirm') {
                modalIcon.textContent = "💾";
                modalCancelBtn.style.display = "block";
                modalOkBtn.textContent = "Yes, Save";
            } else if (type === 'delete') {
                modalIcon.textContent = "🗑️";
                modalCancelBtn.style.display = "block";
                modalOkBtn.textContent = "Delete";
                modalOkBtn.style.background = "linear-gradient(135deg, #dc3545, #c82333)";
            } else if (type === 'success') {
                modalIcon.textContent = "✅";
                modalCancelBtn.style.display = "none";
                modalOkBtn.textContent = "Great";
            }
            customModal.style.display = "flex";
        }

        modalCancelBtn.addEventListener("click", () => { customModal.style.display = "none"; currentModalCallback = null; });
        modalOkBtn.addEventListener("click", () => { customModal.style.display = "none"; if (currentModalCallback) currentModalCallback(); currentModalCallback = null; });

        /* ================= BILLING LOGIC ================= */
        function setupBillingField(input) {
            input.addEventListener("focus", function() { if (this.value === "0" || this.value === "0.00") this.value = ""; });
            input.addEventListener("blur", function() { if (this.value.trim() === "" || isNaN(parseFloat(this.value))) this.value = "0.00"; else this.value = parseFloat(this.value).toFixed(2); calculateGrandTotal(); });
            input.addEventListener("input", function() { calculateGrandTotal(); });
        }
        billingFields.forEach(field => setupBillingField(field));

        function calculateGrandTotal() {
            const t = parseFloat(total?.value) || 0;
            const c = parseFloat(cartage?.value) || 0;
            const v = parseFloat(conveyance?.value) || 0;
            if (grandTotal) grandTotal.value = (t + c + v).toFixed(2);
        }

        /* ================= AUTO-EXPAND ================= */
        function adjustTextareaHeight(el) {
            if (!el) return;
            el.style.height = "auto";
            el.style.height = (el.scrollHeight + 5) + "px";
        }
        [addressBox, complaintBox, testsBox, medicineBox].forEach(box => {
            if(box) {
                box.addEventListener("input", () => adjustTextareaHeight(box));
                box.addEventListener("focus", () => adjustTextareaHeight(box));
                box.addEventListener("blur", () => setTimeout(() => adjustTextareaHeight(box), 10));
            }
        });

        /* ================= INPUT RESTRICTIONS ================= */
        if (ageInput) {
            ageInput.addEventListener("input", function() {
                let val = this.value.replace(/[^0-9]/g, '');
                if (val.length > 3) val = val.slice(0, 3);
                if (parseInt(val) > 110) val = "110";
                this.value = val;
            });
        }

        if (mobileInput) {
            mobileInput.addEventListener("input", async function() {
                this.value = this.value.replace(/[^0-9]/g, '');
                if (this.value.length > 10) this.value = this.value.slice(0, 10);
                checkOldRecordButton(); 
                const query = this.value.trim();
                if (query.length < 2) { mobileSuggestionsList.classList.add("hidden"); return; }
                try {
                    const res = await fetch(`${API_BASE_URL}/api/visits/mobile-suggestions?query=${encodeURIComponent(query)}`);
                    const results = await res.json();
                    mobileSuggestionsList.innerHTML = "";
                    if (results.length > 0) {
                        results.forEach(item => {
                            const li = document.createElement("li");
                            li.textContent = `${item.B_Mobile} - ${item.B_PName}`; 
                            li.onclick = async () => {
                                mobileInput.value = item.B_Mobile; 
                                mobileSuggestionsList.classList.add("hidden"); 
                                checkOldRecordButton();
                                try {
                                    const searchRes = await fetch(`${API_BASE_URL}/api/visits/search?mobile=${encodeURIComponent(item.B_Mobile)}`);
                                    const searchData = await searchRes.json();
                                    if(searchData.records && searchData.records.length > 0) {
                                        autoFillPatientDetails(searchData.records[0]);
                                    }
                                } catch(e) { console.error(e); }
                            };
                            mobileSuggestionsList.appendChild(li);
                        });
                        mobileSuggestionsList.classList.remove("hidden");
                    } else { mobileSuggestionsList.classList.add("hidden"); }
                } catch (err) { console.error(err); }
            });
            document.addEventListener("click", function(e) { if (e.target !== mobileInput) mobileSuggestionsList.classList.add("hidden"); });
        }

        if (patientNameInput && suggestionsList) {
            patientNameInput.addEventListener("input", async function() {
                checkOldRecordButton();
                const query = this.value.trim();
                if (query.length < 1) { suggestionsList.classList.add("hidden"); return; }
                try {
                    const res = await fetch(`${API_BASE_URL}/api/visits/suggestions?query=${encodeURIComponent(query)}`);
                    const names = await res.json();
                    suggestionsList.innerHTML = "";
                    if (names.length > 0) {
                        names.forEach(item => {
                            const li = document.createElement("li");
                            li.textContent = item.B_PName;
                            li.onclick = async () => {
                                patientNameInput.value = item.B_PName; 
                                suggestionsList.classList.add("hidden"); 
                                checkOldRecordButton();
                                try {
                                    const searchRes = await fetch(`${API_BASE_URL}/api/visits/search?name=${encodeURIComponent(item.B_PName)}`);
                                    const searchData = await searchRes.json();
                                    if(searchData.records && searchData.records.length > 0) {
                                        autoFillPatientDetails(searchData.records[0]);
                                    }
                                } catch(e) { console.error(e); }
                            };
                            suggestionsList.appendChild(li);
                        });
                        suggestionsList.classList.remove("hidden");
                    } else { suggestionsList.classList.add("hidden"); }
                } catch (err) { console.error(err); }
            });
            document.addEventListener("click", function(e) { if (e.target !== patientNameInput) suggestionsList.classList.add("hidden"); });
        }

        /* ================= AUTO-FILL & TOGGLE ================= */
        function autoFillPatientDetails(record) {
            patientNameInput.value = record.B_PName || "";
            fatherNameInput.value = record.B_FName || "";
            if(sexInput) sexInput.value = record.B_Sex || "";
            if(ageInput) ageInput.value = record.B_Age || "";
            if(mobileInput) mobileInput.value = record.B_Mobile || ""; 
            if(addressBox) { addressBox.value = record.B_To || ""; setTimeout(() => adjustTextareaHeight(addressBox), 50); }

            // Clear ALL clinical fields including Tests
            if(complaintBox) { complaintBox.value = ""; adjustTextareaHeight(complaintBox); }
            if(testsBox) { testsBox.value = ""; adjustTextareaHeight(testsBox); } // NEW
            if(medicineBox) { medicineBox.value = ""; adjustTextareaHeight(medicineBox); }
            
            if(total) total.value = "0.00";
            if(cartage) cartage.value = "0.00";
            if(conveyance) conveyance.value = "0.00";
            if(grandTotal) grandTotal.value = "0.00";

            checkOldRecordButton();
        }

        function toggleEditMode(enable) {
            isEditMode = enable;
            if (enable) {
                saveBtn.classList.add("hidden");
                updateBtn.classList.remove("hidden");
                deleteBtn.classList.remove("hidden");
                saveAsNewBtn.classList.remove("hidden"); 
                snoInput.style.backgroundColor = "#e0e0e0"; 
            } else {
                saveBtn.classList.remove("hidden");
                updateBtn.classList.add("hidden");
                deleteBtn.classList.add("hidden");
                saveAsNewBtn.classList.add("hidden"); 
                snoInput.style.backgroundColor = "white";
            }
        }

        function validateForm() { 
            if (!patientNameInput.value.trim()) { showModal('alert', 'Missing Name', 'Please enter the Patient Name.'); patientNameInput.focus(); return false; } 
            if (!fatherNameInput.value.trim()) { showModal('alert', 'Missing Father Name', 'Please enter Father\'s Name.'); fatherNameInput.focus(); return false; }
            if (!sexInput.value || sexInput.value === "Select") { showModal('alert', 'Missing Gender', 'Please select a Gender.'); sexInput.focus(); return false; }
            if (!ageInput.value || parseInt(ageInput.value) <= 0) { showModal('alert', 'Invalid Age', 'Please enter a valid Age.'); ageInput.focus(); return false; }
            
            const mobileVal = mobileInput.value.trim();
            if (mobileVal.length > 0 && mobileVal.length !== 10) { showModal('alert', 'Invalid Mobile', 'Mobile Number must be exactly 10 digits.'); mobileInput.focus(); return false; }

            if (!addressBox.value.trim()) { showModal('alert', 'Missing Address', 'Please enter the Address.'); addressBox.focus(); return false; }
            if (!complaintBox.value.trim()) { showModal('alert', 'Missing Complaint', 'Please enter the Chief Complaint.'); complaintBox.focus(); return false; }
            // Tests are optional, so we don't block save if empty
            if (!medicineBox.value.trim()) { showModal('alert', 'Missing Medicine', 'Please enter the Medicine.'); medicineBox.focus(); return false; }
            if (!grandTotal.value.trim() || parseFloat(grandTotal.value) < 0) { showModal('alert', 'Missing Billing', 'Billing details are incomplete.'); grandTotal.focus(); return false; }

            return true; 
        }

        /* ================= CRUD ================= */
        function getPayload() {
            return {
                date: visitDate.value,
                patientName: getEl("patientNameInput").value,
                sex: sexInput.value,
                fatherName: getEl("fatherNameInput").value,
                mobile: mobileInput ? mobileInput.value : "",
                age: (getEl("age") || form.querySelector("#age")).value,
                address: (getEl("address") || form.querySelector(".address-box")).value,
                chiefComplaint: complaintBox.value,
                tests: testsBox.value, // Added Tests
                medicine: medicineBox.value,
                total: total.value,
                cartage: cartage.value,
                conveyance: conveyance.value,
                grandTotal: grandTotal.value
            };
        }

        function fillForm(record) {
            patientNameInput.value = record.B_PName || "";
            fatherNameInput.value = record.B_FName || "";
            if(sexInput) sexInput.value = record.B_Sex || "";
            if(ageInput) ageInput.value = record.B_Age || "";
            if(mobileInput) mobileInput.value = record.B_Mobile || ""; 
            if(addressBox) addressBox.value = record.B_To || "";
            
            // Fill Clinical Data including Tests
            if(complaintBox) complaintBox.value = record.B_Perticu1 || "";
            if(testsBox) testsBox.value = record.B_Tests || ""; 
            if(medicineBox) medicineBox.value = record.B_Perticu2 || "";
            
            setTimeout(() => { adjustTextareaHeight(addressBox); adjustTextareaHeight(complaintBox); adjustTextareaHeight(testsBox); adjustTextareaHeight(medicineBox); }, 50);
            
            snoInput.value = record.B_Sno || "";
            if (visitDate && record.B_Date) visitDate.value = new Date(record.B_Date).toISOString().split('T')[0];
            total.value = (record.B_PerticuAmt1 || 0).toFixed(2);
            cartage.value = (record.B_Cart || 0).toFixed(2);
            conveyance.value = (record.B_Conv || 0).toFixed(2);
            grandTotal.value = (record.B_TotalAmt || 0).toFixed(2);
            checkOldRecordButton();
        }

        if (saveBtn) {
            saveBtn.addEventListener("click", (e) => {
                e.preventDefault();
                if (!validateForm()) return;
                showModal('confirm', 'Confirm Save', 'Are you sure you want to save this record?', async () => {
                    saveBtn.disabled = true; saveBtn.innerText = "Saving...";
                    try {
                        const res = await fetch(`${API_BASE_URL}/api/visits`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(getPayload()) });
                        if (res.ok) { showModal('success', 'Saved', 'Record Saved Successfully!'); resetForm(); } 
                        else { showModal('alert', 'Error', 'Failed to save record.'); }
                    } catch (err) { showModal('alert', 'Error', 'Server Error.'); } 
                    finally { saveBtn.disabled = false; saveBtn.innerText = "Save"; }
                });
            });
        }

        if (updateBtn) {
            updateBtn.addEventListener("click", (e) => {
                e.preventDefault();
                if (!validateForm()) return;
                showModal('confirm', 'Confirm Update', 'Are you sure you want to update this record?', async () => {
                    updateBtn.disabled = true; updateBtn.innerText = "Updating...";
                    try {
                        const res = await fetch(`${API_BASE_URL}/api/visits/${snoInput.value}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(getPayload()) });
                        if (res.ok) { showModal('success', 'Updated', 'Record Updated Successfully!'); resetForm(); } 
                        else { showModal('alert', 'Error', 'Update failed.'); }
                    } catch (err) { showModal('alert', 'Error', 'Server Error.'); } 
                    finally { updateBtn.disabled = false; updateBtn.innerText = "Update"; }
                });
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener("click", (e) => {
                e.preventDefault();
                showModal('delete', 'Confirm Delete', `Delete record #${snoInput.value}?`, async () => {
                    deleteBtn.disabled = true; deleteBtn.innerText = "Deleting...";
                    try {
                        const res = await fetch(`${API_BASE_URL}/api/visits/${snoInput.value}`, { method: "DELETE" });
                        if (res.ok) { showModal('success', 'Deleted', 'Record Deleted Successfully.'); resetForm(); } 
                        else { showModal('alert', 'Error', 'Delete failed.'); }
                    } catch (err) { showModal('alert', 'Error', 'Server Error.'); } 
                    finally { deleteBtn.disabled = false; deleteBtn.innerText = "Delete"; }
                });
            });
        }

        if (saveAsNewBtn) {
            saveAsNewBtn.addEventListener("click", (e) => {
                e.preventDefault();
                if (!validateForm()) return;
                showModal('confirm', 'Save as New Record', 'Create a NEW visit with today\'s date using these details?', async () => {
                    saveAsNewBtn.disabled = true; saveAsNewBtn.innerText = "Saving...";
                    const payload = getPayload();
                    const now = new Date();
                    payload.date = now.toISOString().split('T')[0];
                    try {
                        const res = await fetch(`${API_BASE_URL}/api/visits`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
                        if (res.ok) { showModal('success', 'Created', 'New Visit Created Successfully!'); resetForm(); } 
                        else { showModal('alert', 'Error', 'Failed to create record.'); }
                    } catch (err) { showModal('alert', 'Error', 'Server Error.'); } 
                    finally { saveAsNewBtn.disabled = false; saveAsNewBtn.innerText = "Save as New Record"; }
                });
            });
        }

        // PRINT LOGIC (Updated for Tests)
        if (printBtn) {
            printBtn.addEventListener("click", () => {
                if (!validateForm()) return;
                const name = patientNameInput.value.trim();
                const date = visitDate.value || new Date().toISOString().split('T')[0];
                const printWindow = window.open('', '', 'height=600,width=800');
                printWindow.document.write('<html><head><title>Print Bill</title><style>body{font-family:Arial,sans-serif;padding:20px;-webkit-print-color-adjust:exact}.print-header{background-color:#ffff00;color:#ff0000;text-align:center;padding:15px;margin-bottom:20px;border:1px solid #ddd}.clinic-name{font-size:22px;font-weight:bold;text-transform:uppercase;margin-bottom:5px;letter-spacing:1px}.dr-name{font-size:32px;font-weight:900;text-transform:uppercase;margin-bottom:5px}.designation{font-size:16px;font-weight:bold;margin-bottom:2px}.address-line{color:#000;font-size:12px;margin-top:10px;font-weight:normal}.receipt-title{text-align:center;margin:10px 0 20px 0;font-size:18px;font-weight:bold;text-transform:uppercase;border-bottom:2px solid #333;display:inline-block;padding-bottom:5px}.title-container{text-align:center}.info-grid{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;border:1px solid #333;padding:10px;font-weight:bold}.section-title{font-weight:bold;margin-top:10px;background:#eee;padding:5px;border-left:5px solid #ff0000}.content-box{border:1px solid #ccc;padding:10px;min-height:50px;margin-bottom:10px;white-space:pre-wrap;font-size:14px}.billing-table{width:100%;border-collapse:collapse;margin-top:15px}.billing-table th,.billing-table td{border:1px solid #000;padding:8px;text-align:left}.total-row{font-weight:bold;background-color:#f0f0f0}</style></head><body>');
                
                printWindow.document.write('<div class="print-header"><div class="clinic-name">S.S. HOMOEO CARE CLINIC</div><div class="dr-name">DR. S.S. GUPTA</div><div class="designation">M.D. (Homoeo)</div><div class="designation">Psychiatrist</div><div class="address-line">Address: Your Clinic Address Here | Phone: 9999999999</div></div>');
                printWindow.document.write('<div class="title-container"><div class="receipt-title">Patient Receipt</div></div>');
                printWindow.document.write(`<div class="info-grid"><div>NAME: ${name.toUpperCase()}</div><div>DATE: ${date}</div></div>`);
                
                printWindow.document.write(`<div class="section-title">Chief Complaint</div><div class="content-box">${complaintBox.value}</div>`);
                
                if(testsBox.value.trim() !== "") {
                    printWindow.document.write(`<div class="section-title">Tests / Investigation</div><div class="content-box">${testsBox.value}</div>`);
                }

                printWindow.document.write(`<div class="section-title">Medicine</div><div class="content-box">${medicineBox.value}</div>`);
                printWindow.document.write(`<div class="section-title">Billing Details</div><table class="billing-table"><tr><td>Total</td><td>${total.value||'0.00'}</td></tr><tr><td>Cartage</td><td>${cartage.value||'0.00'}</td></tr><tr><td>Conveyance</td><td>${conveyance.value||'0.00'}</td></tr><tr class="total-row"><td>Grand Total</td><td>${grandTotal.value}</td></tr></table>`);
                
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                setTimeout(() => { printWindow.print(); }, 500);
            });
        }

        function renderPatientList(records) {
            modalTitleText.textContent = "All Unique Patients";
            tableHead.innerHTML = `<tr><th>Patient Name</th><th>Father's Name</th><th>Mobile</th><th>Total Visits</th></tr>`;
            tableBody.innerHTML = "";
            if (records.length === 0) { tableBody.innerHTML = "<tr><td colspan='4'>No patients found.</td></tr>"; return; }
            records.forEach(rec => {
                const row = document.createElement("tr");
                row.innerHTML = `<td style="font-weight:bold; color:#0056b3;">${rec.B_PName}</td><td>${rec.B_FName || '-'}</td><td>${rec.B_Mobile || '-'}</td><td>${rec.VisitCount}</td>`;
                row.onclick = () => loadVisitsForPatient(rec.B_PName, rec.B_Mobile);
                tableBody.appendChild(row);
            });
            historyModal.style.display = "flex";
        }

        async function loadVisitsForPatient(name, mobile) {
            let queryParam = "";
            if (mobile && mobile.length === 10) { queryParam = `mobile=${encodeURIComponent(mobile)}`; } 
            else if (name) { queryParam = `name=${encodeURIComponent(name)}`; }
            try {
                const res = await fetch(`${API_BASE_URL}/api/visits/search?${queryParam}`);
                const data = await res.json();
                modalTitleText.textContent = `Visits for: ${name}`;
                tableHead.innerHTML = `<tr><th>Date</th><th>Patient Name</th><th>Father's Name</th><th>Grand Total</th></tr>`;
                tableBody.innerHTML = "";
                if (data.records.length === 0) { tableBody.innerHTML = "<tr><td colspan='4'>No visits found.</td></tr>"; return; }
                data.records.forEach(rec => {
                    const date = new Date(rec.B_Date).toLocaleDateString('en-GB'); 
                    const row = document.createElement("tr");
                    row.innerHTML = `<td>${date}</td><td>${rec.B_PName}</td><td>${rec.B_FName || '-'}</td><td>${rec.B_TotalAmt || 0}</td>`;
                    row.onclick = () => { fillForm(rec); toggleEditMode(true); historyModal.style.display = "none"; };
                    tableBody.appendChild(row);
                });
            } catch (err) { showModal('alert', 'Error', 'Could not load visits.'); }
        }

        if (showAllBtn) {
            showAllBtn.addEventListener("click", async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/visits/all-patients`);
                    const records = await res.json();
                    renderPatientList(records);
                } catch (err) { showModal('alert', 'Error', 'Error fetching patients list.'); }
            });
        }

        if (oldRecordBtn) {
            oldRecordBtn.addEventListener("click", async () => {
                const name = patientNameInput.value.trim();
                const mobile = mobileInput.value.trim();
                if (!name && mobile.length !== 10) { showModal('alert', 'Missing Information', 'Please enter a valid Name or Mobile Number.'); return; }
                loadVisitsForPatient(name, mobile);
                historyModal.style.display = "flex";
            });
        }

        function resetForm() {
            form.reset();
            billingFields.forEach(f => f.value = "0.00");
            grandTotal.value = "0.00";
            [addressBox, complaintBox, testsBox, medicineBox].forEach(b => { if(b) b.style.height = "auto"; });
            toggleEditMode(false);
            loadNextSno();
            visitDate.value = new Date().toISOString().split('T')[0];
            checkOldRecordButton();
        }

        async function loadNextSno() {
            try { const res = await fetch(`${API_BASE_URL}/api/visits/next-sno`); const data = await res.json(); if (res.ok) snoInput.value = data.nextSno; } catch (err) { console.error(err); }
        }

        loadNextSno(); 
        if(visitDate) visitDate.value = new Date().toISOString().split('T')[0];
        if (cancelBtn) cancelBtn.addEventListener("click", resetForm);
        if (closeModalBtn) closeModalBtn.onclick = () => { historyModal.style.display = "none"; };
    }
    startApp();
})();