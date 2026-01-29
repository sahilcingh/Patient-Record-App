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

        const modal = getEl("historyModal");
        const tableBody = getEl("historyTableBody");
        const closeModalBtn = getEl("closeModalBtn");

        let isEditMode = false;

        // 1. DEFAULT DISABLE OLD RECORD BUTTON
        if(oldRecordBtn) {
            oldRecordBtn.disabled = true;
            oldRecordBtn.style.opacity = "0.5";
            oldRecordBtn.style.cursor = "not-allowed";
        }

        // 2. AUTOCOMPLETE & VERIFICATION LOGIC
        if (patientNameInput && suggestionsList) {
            patientNameInput.addEventListener("input", async function() {
                const query = this.value.trim();
                
                if (query.length < 1) {
                    suggestionsList.classList.add("hidden");
                    if(oldRecordBtn) {
                        oldRecordBtn.disabled = true;
                        oldRecordBtn.style.opacity = "0.5";
                        oldRecordBtn.style.cursor = "not-allowed";
                    }
                    return;
                }
                
                try {
                    const res = await fetch(`${API_BASE_URL}/api/visits/suggestions?query=${encodeURIComponent(query)}`);
                    const names = await res.json();
                    
                    suggestionsList.innerHTML = "";
                    
                    // Logic: If suggestions exist -> Enable Button
                    if (names.length > 0) {
                        if(oldRecordBtn) {
                            oldRecordBtn.disabled = false;
                            oldRecordBtn.style.opacity = "1";
                            oldRecordBtn.style.cursor = "pointer";
                        }

                        names.forEach(item => {
                            const li = document.createElement("li");
                            li.textContent = item.B_PName;
                            li.onclick = () => {
                                patientNameInput.value = item.B_PName; 
                                suggestionsList.classList.add("hidden"); 
                                if(oldRecordBtn) {
                                    oldRecordBtn.disabled = false;
                                    oldRecordBtn.style.opacity = "1";
                                    oldRecordBtn.style.cursor = "pointer";
                                    oldRecordBtn.click(); // Auto-click
                                }
                            };
                            suggestionsList.appendChild(li);
                        });
                        suggestionsList.classList.remove("hidden");
                    } else {
                        // No results -> Disable Button
                        suggestionsList.classList.add("hidden");
                        if(oldRecordBtn) {
                            oldRecordBtn.disabled = true;
                            oldRecordBtn.style.opacity = "0.5";
                            oldRecordBtn.style.cursor = "not-allowed";
                        }
                    }
                } catch (err) { console.error(err); }
            });

            document.addEventListener("click", function(e) {
                if (e.target !== patientNameInput) suggestionsList.classList.add("hidden");
            });
        }

        // 3. OLD RECORD SEARCH CLICK (Uses Name in 2nd Column)
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
                            // Changed: 2nd col is Name
                            row.innerHTML = `
                                <td>${date}</td>
                                <td>${rec.B_PName}</td>
                                <td>${rec.B_FName || '-'}</td>
                                <td>${rec.B_TotalAmt || 0}</td>
                                <td><button type="button" class="select-btn">Select</button></td>
                            `;
                            row.querySelector(".select-btn").onclick = () => {
                                fillForm(rec);
                                toggleEditMode(true);
                                modal.style.display = "none";
                            };
                            tableBody.appendChild(row);
                        });
                        modal.style.display = "flex"; 
                    } else { 
                        alert("No records found."); 
                    }
                } catch (err) { alert("Error loading history."); }
            });
        }

        /* ENTER KEY NAV */
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

        /* DECIMAL FORMAT */
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

        /* VALIDATION */
        function validateForm() {
            const requiredFields = [
                { el: patientNameInput, name: "Patient Name" },
                { el: fatherNameInput, name: "Father's Name" },
                { el: sexInput, name: "Gender" },
                { el: ageInput, name: "Age" },
                { el: form.querySelectorAll(".large-box")[0], name: "Chief Complaint" },
                { el: form.querySelectorAll(".large-box")[1], name: "Medicine" }
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

        /* INPUT HANDLERS */
        if (ageInput) {
            ageInput.addEventListener("input", function() { if (this.value < 0) this.value = 0; });
            ageInput.addEventListener("keydown", function(e) { if (e.key === "-" || e.key === "e") e.preventDefault(); });
        }
        function cleanNameInput(input) {
            input.addEventListener("input", function() { this.value = this.value.replace(/[^a-zA-Z\s]/g, ''); });
        }
        if (patientNameInput) cleanNameInput(patientNameInput);
        if (fatherNameInput) cleanNameInput(fatherNameInput);

        /* HELPERS */
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
            calculateGrandTotal();
            toggleEditMode(false); 
            loadNextSno(); 
            const now = new Date();
            if(visitDate) visitDate.value = now.toISOString().split('T')[0];
        }

        billingFields.forEach(field => {
            field.addEventListener("focus", () => { if (parseFloat(field.value) === 0) field.value = ""; });
            field.addEventListener("blur", () => { if (field.value.trim() === "") field.value = "0"; calculateGrandTotal(); });
            field.addEventListener("input", calculateGrandTotal);
        });
        
        if (cancelBtn) cancelBtn.addEventListener("click", resetForm);
        if (closeModalBtn) closeModalBtn.onclick = () => { modal.style.display = "none"; };

        /* CRUD BUTTONS */
        if (saveBtn) {
            saveBtn.addEventListener("click", async (e) => {
                e.preventDefault(); 
                if (!validateForm()) return; 
                if (!confirm("Are you sure you want to save this record?")) return;
                saveBtn.disabled = true; saveBtn.innerText = "Saving...";
                try {
                    const res = await fetch(`${API_BASE_URL}/api/visits`, {
                        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(getPayload())
                    });
                    if (res.ok) { alert("Saved!"); resetForm(); } else { alert("Save failed."); }
                } catch (err) { alert("Error."); } finally { saveBtn.disabled = false; saveBtn.innerText = "Save"; }
            });
        }

        if (updateBtn) {
            updateBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                const currentSno = snoInput.value;
                if (!currentSno) return;
                if (!validateForm()) return;
                if (!confirm("Are you sure you want to update this record?")) return;
                updateBtn.disabled = true; updateBtn.innerText = "Updating...";
                try {
                    const res = await fetch(`${API_BASE_URL}/api/visits/${currentSno}`, {
                        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(getPayload())
                    });
                    if (res.ok) { alert("Updated successfully!"); resetForm(); } else { alert("Update failed."); }
                } catch (err) { alert("Error."); } finally { updateBtn.disabled = false; updateBtn.innerText = "Update"; }
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                const currentSno = snoInput.value;
                if (!confirm(`Are you sure you want to delete record #${currentSno}?`)) return;
                deleteBtn.disabled = true; deleteBtn.innerText = "Deleting...";
                try {
                    const res = await fetch(`${API_BASE_URL}/api/visits/${currentSno}`, { method: "DELETE" });
                    if (res.ok) { alert("Deleted successfully!"); resetForm(); } else { alert("Delete failed."); }
                } catch (err) { alert("Error."); } finally { deleteBtn.disabled = false; deleteBtn.innerText = "Delete"; }
            });
        }

        function fillForm(record) {
            getEl("patientNameInput").value = record.B_PName || "";
            getEl("fatherNameInput").value = record.B_FName || "";
            if(sexInput) sexInput.value = record.B_Sex || "";
            (getEl("age") || form.querySelector("#age")).value = record.B_Age || "";
            (getEl("address") || form.querySelector(".address-box")).value = record.B_To || "";
            const boxes = form.querySelectorAll(".large-box");
            if (boxes[0]) boxes[0].value = record.B_Perticu1 || "";
            if (boxes[1]) boxes[1].value = record.B_Perticu2 || "";
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
                chiefComplaint: form.querySelectorAll(".large-box")[0].value,
                medicine: form.querySelectorAll(".large-box")[1].value,
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