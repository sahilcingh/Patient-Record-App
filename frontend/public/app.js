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
        
        const total = getEl("total");
        const cartage = getEl("cartage");
        const conveyance = getEl("conveyance");
        const grandTotal = getEl("grandTotal");
        const visitDate = getEl("visitDate");
        const billingFields = [total, cartage, conveyance].filter(Boolean);

        const patientNameInput = getEl("patientNameInput");
        const fatherNameInput = getEl("fatherNameInput");
        const suggestionsList = getEl("suggestionsList");

        const saveBtn = form.querySelector('#saveBtn');
        const updateBtn = form.querySelector('#updateBtn'); 
        const deleteBtn = form.querySelector('#deleteBtn'); 
        const cancelBtn = form.querySelector('#cancelBtn'); 
        const oldRecordBtn = getEl("oldRecordBtn");
        const printBtn = getEl("printBtn"); 

        const modal = getEl("historyModal");
        const tableBody = getEl("historyTableBody");
        const closeModalBtn = getEl("closeModalBtn");

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

        /* ================= 1. AUTO-EXPAND LOGIC ================= */
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

        /* ================= PRINT BILL FUNCTION (CUSTOM HEADER) ================= */
        if (printBtn) {
            printBtn.addEventListener("click", () => {
                const name = patientNameInput.value || "N/A";
                const date = visitDate.value || new Date().toISOString().split('T')[0];
                const complaint = complaintBox.value || "-";
                const medicine = medicineBox.value || "-";
                const grandTotalVal = grandTotal.value || "0.00";

                const printWindow = window.open('', '', 'height=600,width=800');
                printWindow.document.write('<html><head><title>Print Bill</title>');
                printWindow.document.write('<style>');
                printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; -webkit-print-color-adjust: exact; }');
                
                /* === NEW HEADER STYLES (MATCHING IMAGE) === */
                printWindow.document.write('.print-header { background-color: #ffff00; color: #ff0000; text-align: center; padding: 15px; margin-bottom: 20px; border: 1px solid #ddd; }');
                printWindow.document.write('.clinic-name { font-size: 22px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 1px; }');
                printWindow.document.write('.dr-name { font-size: 32px; font-weight: 900; text-transform: uppercase; margin-bottom: 5px; }');
                printWindow.document.write('.designation { font-size: 16px; font-weight: bold; margin-bottom: 2px; }');
                printWindow.document.write('.address-line { color: #000; font-size: 12px; margin-top: 10px; font-weight: normal; }');

                /* CONTENT STYLES */
                printWindow.document.write('.receipt-title { text-align: center; margin: 10px 0 20px 0; font-size: 18px; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #333; display: inline-block; padding-bottom: 5px; }');
                printWindow.document.write('.title-container { text-align: center; }');

                printWindow.document.write('.info-grid { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border: 1px solid #333; padding: 10px; font-weight: bold; }');
                
                printWindow.document.write('.section-title { font-weight: bold; margin-top: 10px; background: #eee; padding: 5px; border-left: 5px solid #ff0000; }');
                printWindow.document.write('.content-box { border: 1px solid #ccc; padding: 10px; min-height: 50px; margin-bottom: 10px; white-space: pre-wrap; font-size: 14px; }');
                
                printWindow.document.write('.billing-table { width: 100%; border-collapse: collapse; margin-top: 15px; }');
                printWindow.document.write('.billing-table th, .billing-table td { border: 1px solid #000; padding: 8px; text-align: left; }');
                printWindow.document.write('.total-row { font-weight: bold; background-color: #f0f0f0; }');
                printWindow.document.write('</style>');
                printWindow.document.write('</head><body>');
                
                // === HEADER HTML ===
                printWindow.document.write('<div class="print-header">');
                    printWindow.document.write('<div class="clinic-name">S.S. HOMOEO CARE CLINIC</div>');
                    printWindow.document.write('<div class="dr-name">DR. S.S. GUPTA</div>');
                    printWindow.document.write('<div class="designation">M.D. (Homoeo)</div>');
                    printWindow.document.write('<div class="designation">Psychiatrist</div>');
                    // Kept address small at bottom of header as per standard billing requirements
                    printWindow.document.write('<div class="address-line">Address: Your Clinic Address Here | Phone: 9999999999</div>');
                printWindow.document.write('</div>');

                printWindow.document.write('<div class="title-container"><div class="receipt-title">Patient Receipt</div></div>');
                
                // Info Grid (Name Left, Date Right)
                printWindow.document.write('<div class="info-grid">');
                printWindow.document.write(`<div>NAME: ${name.toUpperCase()}</div>`);
                printWindow.document.write(`<div>DATE: ${date}</div>`);
                printWindow.document.write('</div>');

                printWindow.document.write('<div class="section-title">Chief Complaint</div>');
                printWindow.document.write(`<div class="content-box">${complaint}</div>`);

                printWindow.document.write('<div class="section-title">Medicine</div>');
                printWindow.document.write(`<div class="content-box">${medicine}</div>`);

                printWindow.document.write('<div class="section-title">Billing Details</div>');
                printWindow.document.write('<table class="billing-table">');
                printWindow.document.write(`<tr><td>Total</td><td>${total.value || '0.00'}</td></tr>`);
                printWindow.document.write(`<tr><td>Cartage</td><td>${cartage.value || '0.00'}</td></tr>`);
                printWindow.document.write(`<tr><td>Conveyance</td><td>${conveyance.value || '0.00'}</td></tr>`);
                printWindow.document.write(`<tr class="total-row"><td>Grand Total</td><td>${grandTotalVal}</td></tr>`);
                printWindow.document.write('</table>');

                printWindow.document.write('</body></html>');
                printWindow.document.close();
                
                // Delay print to allow styles to load (especially background colors)
                setTimeout(() => {
                    printWindow.print();
                }, 500);
            });
        }

        /* ================= AUTOCOMPLETE & FILL ================= */
        function autoFillPatientDetails(record) {
            patientNameInput.value = record.B_PName || "";
            fatherNameInput.value = record.B_FName || "";
            if(sexInput) sexInput.value = record.B_Sex || "";
            if(ageInput) ageInput.value = record.B_Age || "";
            
            if(addressBox) {
                addressBox.value = record.B_To || "";
                setTimeout(() => adjustTextareaHeight(addressBox), 50);
            }

            if(oldRecordBtn) { oldRecordBtn.disabled = false; oldRecordBtn.style.opacity = "1"; oldRecordBtn.style.cursor = "pointer"; }
        }

        if (patientNameInput && suggestionsList) {
            patientNameInput.addEventListener("input", async function() {
                const query = this.value.trim();
                
                if (query.length < 1) {
                    suggestionsList.classList.add("hidden");
                    if(oldRecordBtn) { oldRecordBtn.disabled = true; oldRecordBtn.style.opacity = "0.5"; oldRecordBtn.style.cursor = "not-allowed"; }
                    return;
                }
                
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
                    } else {
                        suggestionsList.classList.add("hidden");
                        if(oldRecordBtn) { oldRecordBtn.disabled = true; oldRecordBtn.style.opacity = "0.5"; oldRecordBtn.style.cursor = "not-allowed"; }
                    }
                } catch (err) { console.error(err); }
            });

            document.addEventListener("click", function(e) {
                if (e.target !== patientNameInput) suggestionsList.classList.add("hidden");
            });
        }

        /* OLD RECORD BUTTON */
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
                            row.innerHTML = `
                                <td>${date}</td>
                                <td>${rec.B_PName}</td>
                                <td>${rec.B_FName || '-'}</td>
                                <td>${rec.B_TotalAmt || 0}</td>
                            `;
                            row.onclick = () => {
                                fillForm(rec);
                                toggleEditMode(true);
                                modal.style.display = "none";
                            };
                            tableBody.appendChild(row);
                        });
                        modal.style.display = "flex"; 
                    } else { alert("No records found."); }
                } catch (err) { alert("Error loading history."); }
            });
        }

        /* REST OF LOGIC */
        form.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const target = e.target;
                if (target.tagName === "TEXTAREA") return; 
                e.preventDefault(); 
                if (target.id === "conveyance") {
                    isEditMode ? updateBtn.click() : saveBtn.click();
                    return;
                }
                const focusables = Array.from(form.querySelectorAll("input, select, textarea"));
                const index = focusables.indexOf(target);
                if (index > -1 && index < focusables.length - 1) {
                    focusables[index + 1].focus();
                }
            }
        });

        function formatDecimal(input) {
            input.addEventListener("blur", function() {
                if (this.value) { this.value = parseFloat(this.value).toFixed(2); calculateGrandTotal(); }
            });
            input.addEventListener("input", function() {
                if (this.value.includes('.')) {
                    const parts = this.value.split('.');
                    if (parts[1].length > 2) { this.value = parseFloat(this.value).toFixed(2); }
                }
                calculateGrandTotal();
            });
        }
        billingFields.forEach(field => formatDecimal(field));

        function validateForm() {
            const requiredFields = [
                { el: patientNameInput, name: "Patient Name" },
                { el: fatherNameInput, name: "Father's Name" },
                { el: sexInput, name: "Gender" },
                { el: ageInput, name: "Age" },
                { el: complaintBox, name: "Chief Complaint" },
                { el: medicineBox, name: "Medicine" }
            ];
            for (let field of requiredFields) {
                if (!field.el || field.el.value.trim() === "" || field.el.value === "Select") {
                    alert(`⚠️ Missing Information\n\nPlease enter/select the ${field.name}.`);
                    field.el.focus();
                    return false;
                }
            }
            return true;
        }

        if (ageInput) {
            ageInput.addEventListener("input", function() { if (this.value < 0) this.value = 0; });
            ageInput.addEventListener("keydown", function(e) { if (e.key === "-" || e.key === "e") e.preventDefault(); });
        }
        function cleanNameInput(input) {
            input.addEventListener("input", function() { this.value = this.value.replace(/[^a-zA-Z\s]/g, ''); });
        }
        if (patientNameInput) cleanNameInput(patientNameInput);
        if (fatherNameInput) cleanNameInput(fatherNameInput);

        function toggleEditMode(enable) {
            isEditMode = enable;
            if (enable) {
                if(saveBtn) saveBtn.classList.add("hidden");
                if(updateBtn) updateBtn.classList.remove("hidden");
                if(deleteBtn) deleteBtn.classList.remove("hidden");
                if(snoInput) snoInput.style.backgroundColor = "#e0e0e0"; 
            } else {
                if(saveBtn) saveBtn.classList.remove("hidden");
                if(updateBtn) updateBtn.classList.add("hidden");
                if(deleteBtn) deleteBtn.classList.add("hidden");
                if(snoInput) snoInput.style.backgroundColor = "white";
            }
        }
        function calculateGrandTotal() {
            const t = parseFloat(total?.value) || 0;
            const c = parseFloat(cartage?.value) || 0;
            const v = parseFloat(conveyance?.value) || 0;
            if (grandTotal) grandTotal.value = (t + c + v).toFixed(2);
        }
        function resetForm() {
            form.reset();
            billingFields.forEach(f => f.value = "0.00");
            if (grandTotal) grandTotal.value = "0.00";
            
            if(addressBox) addressBox.style.height = "auto";
            if(complaintBox) complaintBox.style.height = "auto";
            if(medicineBox) medicineBox.style.height = "auto";

            calculateGrandTotal();
            toggleEditMode(false); 
            loadNextSno(); 
            const now = new Date();
            if(visitDate) visitDate.value = now.toISOString().split('T')[0];
        }

        function fillForm(record) {
            getEl("patientNameInput").value = record.B_PName || "";
            getEl("fatherNameInput").value = record.B_FName || "";
            if(sexInput) sexInput.value = record.B_Sex || "";
            (getEl("age") || form.querySelector("#age")).value = record.B_Age || "";
            
            if(addressBox) addressBox.value = record.B_To || "";
            if(complaintBox) complaintBox.value = record.B_Perticu1 || "";
            if(medicineBox) medicineBox.value = record.B_Perticu2 || "";
            
            setTimeout(() => {
                adjustTextareaHeight(addressBox);
                adjustTextareaHeight(complaintBox);
                adjustTextareaHeight(medicineBox);
            }, 50);

            snoInput.value = record.B_Sno || "";
            if (visitDate && record.B_Date) visitDate.value = new Date(record.B_Date).toISOString().split('T')[0];
            total.value = (record.B_PerticuAmt1 || 0).toFixed(2);
            cartage.value = (record.B_Cart || 0).toFixed(2);
            conveyance.value = (record.B_Conv || 0).toFixed(2);
            grandTotal.value = (record.B_TotalAmt || 0).toFixed(2);
        }

        async function loadNextSno() {
            if (!snoInput) return;
            try {
                const res = await fetch(`${API_BASE_URL}/api/visits/next-sno`);
                const data = await res.json();
                if (res.ok) snoInput.value = data.nextSno;
            } catch (err) { console.error(err); }
        }
        
        function getPayload() {
            return {
                date: visitDate.value,
                patientName: getEl("patientNameInput").value,
                sex: sexInput.value,
                fatherName: getEl("fatherNameInput").value, 
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

        loadNextSno(); 
        toggleEditMode(false); 
        if(visitDate) {
             const now = new Date();
             visitDate.value = now.toISOString().split('T')[0];
             visitDate.focus(); 
        }
    }
    startApp();
})();