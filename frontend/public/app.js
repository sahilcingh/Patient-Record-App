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
        const oldRecordBtn = getEl("oldRecordBtn");
        const printBtn = getEl("printBtn"); 

        const modal = getEl("historyModal");
        const tableBody = getEl("historyTableBody");
        const closeModalBtn = getEl("closeModalBtn");

        // Confirm Modal Elements
        const confirmModal = getEl("confirmModal");
        const confirmYesBtn = getEl("confirmYesBtn");
        const confirmCancelBtn = getEl("confirmCancelBtn");
        const confirmName = getEl("confirmName");
        const confirmAmount = getEl("confirmAmount");

        // Textareas
        const addressBox = form.querySelector(".address-box");
        const complaintBox = form.querySelectorAll(".large-box")[0];
        const medicineBox = form.querySelectorAll(".large-box")[1];

        let isEditMode = false;

        if(oldRecordBtn) {
            oldRecordBtn.disabled = true;
            oldRecordBtn.style.opacity = "0.5";
            oldRecordBtn.style.cursor = "not-allowed";
        }

        function adjustTextareaHeight(el) {
            if (!el) return;
            el.style.height = "auto";
            el.style.height = (el.scrollHeight + 5) + "px";
        }
        [addressBox, complaintBox, medicineBox].forEach(box => {
            if(box) {
                box.addEventListener("input", () => adjustTextareaHeight(box));
                box.addEventListener("focus", () => adjustTextareaHeight(box));
                box.addEventListener("blur", () => adjustTextareaHeight(box));
            }
        });

        /* MOBILE AUTOCOMPLETE */
        if (mobileInput && mobileSuggestionsList) {
            mobileInput.addEventListener("input", async function() {
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

        /* NAME AUTOCOMPLETE */
        if (patientNameInput && suggestionsList) {
            patientNameInput.addEventListener("input", async function() {
                const query = this.value.trim();
                if (query.length < 1) { suggestionsList.classList.add("hidden"); return; }
                try {
                    const res = await fetch(`${API_BASE_URL}/api/visits/suggestions?query=${encodeURIComponent(query)}`);
                    const names = await res.json();
                    suggestionsList.innerHTML = "";
                    if (names.length > 0) {
                        if(oldRecordBtn) { oldRecordBtn.disabled = false; oldRecordBtn.style.opacity = "1"; oldRecordBtn.style.cursor = "pointer"; }
                        names.forEach(item => {
                            const li = document.createElement("li");
                            li.textContent = item.B_PName;
                            li.onclick = async () => {
                                patientNameInput.value = item.B_PName; 
                                suggestionsList.classList.add("hidden"); 
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

        function autoFillPatientDetails(record) {
            patientNameInput.value = record.B_PName || "";
            fatherNameInput.value = record.B_FName || "";
            if(sexInput) sexInput.value = record.B_Sex || "";
            if(ageInput) ageInput.value = record.B_Age || "";
            if(mobileInput && record.B_Mobile) mobileInput.value = record.B_Mobile; 
            
            if(addressBox) {
                addressBox.value = record.B_To || "";
                setTimeout(() => adjustTextareaHeight(addressBox), 50);
            }

            if(complaintBox) { complaintBox.value = ""; adjustTextareaHeight(complaintBox); }
            if(medicineBox) { medicineBox.value = ""; adjustTextareaHeight(medicineBox); }

            if(total) total.value = "0.00";
            if(cartage) cartage.value = "0.00";
            if(conveyance) conveyance.value = "0.00";
            if(grandTotal) grandTotal.value = "0.00";

            if(oldRecordBtn) { oldRecordBtn.disabled = false; oldRecordBtn.style.opacity = "1"; oldRecordBtn.style.cursor = "pointer"; }
        }

        /* SAVE WITH POPUP */
        if (saveBtn) {
            saveBtn.addEventListener("click", (e) => {
                e.preventDefault();
                if (!validateForm()) return;
                confirmName.textContent = patientNameInput.value;
                confirmAmount.textContent = grandTotal.value;
                confirmModal.style.display = "flex";
            });
        }

        if (confirmCancelBtn) { confirmCancelBtn.addEventListener("click", () => { confirmModal.style.display = "none"; }); }

        if (confirmYesBtn) {
            confirmYesBtn.addEventListener("click", async () => {
                confirmModal.style.display = "none"; 
                saveBtn.disabled = true; saveBtn.innerText = "Saving...";
                try {
                    const res = await fetch(`${API_BASE_URL}/api/visits`, {
                        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(getPayload())
                    });
                    if (res.ok) { alert("Saved Successfully!"); resetForm(); } else { alert("Save failed."); }
                } catch (err) { alert("Error saving record."); } finally { saveBtn.disabled = false; saveBtn.innerText = "Save"; }
            });
        }

        /* PRINT */
        if (printBtn) {
            printBtn.addEventListener("click", () => {
                const name = patientNameInput.value.trim();
                const complaint = complaintBox.value.trim();
                const medicine = medicineBox.value.trim();
                const grandTotalVal = grandTotal.value.trim();

                if (!name) { alert("⚠️ Name Missing"); return; }
                if (!complaint) { alert("⚠️ Complaint Missing"); return; }
                if (!medicine) { alert("⚠️ Medicine Missing"); return; }
                if (!grandTotalVal) { alert("⚠️ Billing Missing"); return; }

                const date = visitDate.value || new Date().toISOString().split('T')[0];
                const printWindow = window.open('', '', 'height=600,width=800');
                printWindow.document.write('<html><head><title>Print Bill</title><style>body{font-family:Arial,sans-serif;padding:20px;-webkit-print-color-adjust:exact}.print-header{background-color:#ffff00;color:#ff0000;text-align:center;padding:15px;margin-bottom:20px;border:1px solid #ddd}.clinic-name{font-size:22px;font-weight:bold;text-transform:uppercase;margin-bottom:5px;letter-spacing:1px}.dr-name{font-size:32px;font-weight:900;text-transform:uppercase;margin-bottom:5px}.designation{font-size:16px;font-weight:bold;margin-bottom:2px}.address-line{color:#000;font-size:12px;margin-top:10px;font-weight:normal}.receipt-title{text-align:center;margin:10px 0 20px 0;font-size:18px;font-weight:bold;text-transform:uppercase;border-bottom:2px solid #333;display:inline-block;padding-bottom:5px}.title-container{text-align:center}.info-grid{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;border:1px solid #333;padding:10px;font-weight:bold}.section-title{font-weight:bold;margin-top:10px;background:#eee;padding:5px;border-left:5px solid #ff0000}.content-box{border:1px solid #ccc;padding:10px;min-height:50px;margin-bottom:10px;white-space:pre-wrap;font-size:14px}.billing-table{width:100%;border-collapse:collapse;margin-top:15px}.billing-table th,.billing-table td{border:1px solid #000;padding:8px;text-align:left}.total-row{font-weight:bold;background-color:#f0f0f0}</style></head><body>');
                printWindow.document.write('<div class="print-header"><div class="clinic-name">S.S. HOMOEO CARE CLINIC</div><div class="dr-name">DR. S.S. GUPTA</div><div class="designation">M.D. (Homoeo)</div><div class="designation">Psychiatrist</div><div class="address-line">Address: Your Clinic Address Here | Phone: 9999999999</div></div>');
                printWindow.document.write('<div class="title-container"><div class="receipt-title">Patient Receipt</div></div>');
                printWindow.document.write(`<div class="info-grid"><div>NAME: ${name.toUpperCase()}</div><div>DATE: ${date}</div></div>`);
                printWindow.document.write(`<div class="section-title">Chief Complaint</div><div class="content-box">${complaint}</div>`);
                printWindow.document.write(`<div class="section-title">Medicine</div><div class="content-box">${medicine}</div>`);
                printWindow.document.write(`<div class="section-title">Billing Details</div><table class="billing-table"><tr><td>Total</td><td>${total.value||'0.00'}</td></tr><tr><td>Cartage</td><td>${cartage.value||'0.00'}</td></tr><tr><td>Conveyance</td><td>${conveyance.value||'0.00'}</td></tr><tr class="total-row"><td>Grand Total</td><td>${grandTotalVal}</td></tr></table>`);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                setTimeout(() => { printWindow.print(); }, 500);
            });
        }

        /* CRUD - UPDATE/DELETE */
        if (updateBtn) {
            updateBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                if (!validateForm()) return;
                if (!confirm("Confirm Update?")) return;
                updateBtn.disabled = true; updateBtn.innerText = "Updating...";
                try {
                    const res = await fetch(`${API_BASE_URL}/api/visits/${snoInput.value}`, {
                        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(getPayload())
                    });
                    if (res.ok) { alert("Updated!"); resetForm(); } else { alert("Failed."); }
                } catch (err) { alert("Error."); } finally { updateBtn.disabled = false; updateBtn.innerText = "Update"; }
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                if (!confirm(`Delete record #${snoInput.value}?`)) return;
                deleteBtn.disabled = true; deleteBtn.innerText = "Deleting...";
                try {
                    const res = await fetch(`${API_BASE_URL}/api/visits/${snoInput.value}`, { method: "DELETE" });
                    if (res.ok) { alert("Deleted!"); resetForm(); } else { alert("Failed."); }
                } catch (err) { alert("Error."); } finally { deleteBtn.disabled = false; deleteBtn.innerText = "Delete"; }
            });
        }

        if (oldRecordBtn) {
            oldRecordBtn.addEventListener("click", async () => {
                const nameInput = document.getElementById("patientNameInput");
                const patientName = nameInput?.value.trim();
                if (!patientName) return;
                try {
                    const res = await fetch(`${API_BASE_URL}/api/visits/search?name=${encodeURIComponent(patientName)}`);
                    const data = await res.json();
                    if (res.ok && data.records.length > 0) {
                        tableBody.innerHTML = ""; 
                        data.records.forEach(rec => {
                            const date = new Date(rec.B_Date).toLocaleDateString('en-GB'); 
                            const row = document.createElement("tr");
                            row.innerHTML = `<td>${date}</td><td>${rec.B_PName}</td><td>${rec.B_FName || '-'}</td><td>${rec.B_TotalAmt || 0}</td>`;
                            row.onclick = () => { fillForm(rec); toggleEditMode(true); modal.style.display = "none"; };
                            tableBody.appendChild(row);
                        });
                        modal.style.display = "flex"; 
                    } else { alert("No records found."); }
                } catch (err) { alert("Error loading history."); }
            });
        }

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
            if(mobileInput && record.B_Mobile) mobileInput.value = record.B_Mobile; 
            if(addressBox) addressBox.value = record.B_To || "";
            if(complaintBox) complaintBox.value = record.B_Perticu1 || "";
            if(medicineBox) medicineBox.value = record.B_Perticu2 || "";
            setTimeout(() => { adjustTextareaHeight(addressBox); adjustTextareaHeight(complaintBox); adjustTextareaHeight(medicineBox); }, 50);
            snoInput.value = record.B_Sno || "";
            if (visitDate && record.B_Date) visitDate.value = new Date(record.B_Date).toISOString().split('T')[0];
            total.value = (record.B_PerticuAmt1 || 0).toFixed(2);
            cartage.value = (record.B_Cart || 0).toFixed(2);
            conveyance.value = (record.B_Conv || 0).toFixed(2);
            grandTotal.value = (record.B_TotalAmt || 0).toFixed(2);
        }

        function validateForm() { if (!patientNameInput.value.trim()) { alert("Name required"); return false; } return true; }
        
        function resetForm() {
            form.reset();
            billingFields.forEach(f => f.value = "0.00");
            grandTotal.value = "0.00";
            if(addressBox) addressBox.style.height = "auto";
            if(complaintBox) complaintBox.style.height = "auto";
            if(medicineBox) medicineBox.style.height = "auto";
            loadNextSno();
            visitDate.value = new Date().toISOString().split('T')[0];
        }

        function formatDecimal(input) { input.addEventListener("input", () => { calculateGrandTotal(); }); }
        billingFields.forEach(field => formatDecimal(field));
        function calculateGrandTotal() {
            const t = parseFloat(total?.value) || 0;
            const c = parseFloat(cartage?.value) || 0;
            const v = parseFloat(conveyance?.value) || 0;
            if (grandTotal) grandTotal.value = (t + c + v).toFixed(2);
        }
        async function loadNextSno() {
            try { const res = await fetch(`${API_BASE_URL}/api/visits/next-sno`); const data = await res.json(); if (res.ok) snoInput.value = data.nextSno; } catch (err) { console.error(err); }
        }

        loadNextSno(); 
        if(visitDate) visitDate.value = new Date().toISOString().split('T')[0];
        if (cancelBtn) cancelBtn.addEventListener("click", resetForm);
        if (closeModalBtn) closeModalBtn.onclick = () => { modal.style.display = "none"; };
    }
    startApp();
})();