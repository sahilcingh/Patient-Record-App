(function initPatientForm() {
    const getEl = (id) => document.getElementById(id);

    async function startApp() {
        const form = getEl("patientForm");
        // Wait for form render
        if (!form) { setTimeout(startApp, 100); return; }
        if (form.dataset.initialized === "true") return;
        form.dataset.initialized = "true";

        // UI Elements
        const snoInput = getEl("sno");
        const total = getEl("total");
        const cartage = getEl("cartage");
        const conveyance = getEl("conveyance");
        const grandTotal = getEl("grandTotal");
        const visitDate = getEl("visitDate");
        const billingFields = [total, cartage, conveyance].filter(Boolean);

        // Buttons
        const saveBtn = form.querySelector('#saveBtn');
        const updateBtn = form.querySelector('#updateBtn'); 
        const deleteBtn = form.querySelector('#deleteBtn'); 
        const cancelBtn = form.querySelector('#cancelBtn'); 
        const oldRecordBtn = getEl("oldRecordBtn");

        // Modal
        const modal = getEl("historyModal");
        const tableBody = getEl("historyTableBody");
        const closeModalBtn = getEl("closeModalBtn");

        // STATE: Track if we are editing
        let isEditMode = false;

        /* ================= DATE VALIDATION ================= */
        if (visitDate) {
            // Get Today's Date
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const today = `${year}-${month}-${day}`;

            // Disable future dates in picker
            visitDate.setAttribute("max", today);

            // Exception Popup
            visitDate.addEventListener("change", () => {
                if (visitDate.value > today) {
                    alert("⚠️ Future Date Error\n\nYou cannot select a future date. The date has been reset to today.");
                    visitDate.value = today;
                }
            });
        }

        /* ================= HELPERS ================= */
        
        function toggleEditMode(enable) {
            isEditMode = enable;
            if (enable) {
                // EDIT MODE: Show Update/Delete, Hide Save
                if(saveBtn) saveBtn.classList.add("hidden");
                if(updateBtn) updateBtn.classList.remove("hidden");
                if(deleteBtn) deleteBtn.classList.remove("hidden");
                
                // Visual cue that we are editing an existing record
                if(snoInput) snoInput.style.backgroundColor = "#e0e0e0"; 
            } else {
                // NEW MODE: Show Save, Hide Update/Delete
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
            billingFields.forEach(f => f.value = "0");
            calculateGrandTotal();
            toggleEditMode(false); // Go back to "Save" mode
            loadNextSno(); // Fetch new S.No
            
            // Reset date to today
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            if(visitDate) visitDate.value = today;
        }

        /* ================= LISTENERS ================= */

        // 1. Navigation
        const allElements = Array.from(form.querySelectorAll("input, select, textarea"));
        allElements.forEach((field, index) => {
            field.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    if (field.tagName === "TEXTAREA" && !e.ctrlKey) return;
                    e.preventDefault(); 
                    const nextField = allElements[index + 1];
                    if (nextField) nextField.focus();
                }
            });
        });

        // 2. Billing
        billingFields.forEach(field => {
            field.addEventListener("focus", () => { if (field.value === "0") field.value = ""; });
            field.addEventListener("blur", () => {
                if (field.value.trim() === "") field.value = "0";
                calculateGrandTotal();
            });
            field.addEventListener("input", calculateGrandTotal);
        });

        // 3. Cancel Button -> Resets everything
        if (cancelBtn) {
            cancelBtn.addEventListener("click", resetForm);
        }

        /* ================= MODAL & OLD RECORD ================= */
        if (closeModalBtn) closeModalBtn.onclick = () => { modal.style.display = "none"; };

        if (oldRecordBtn) {
            oldRecordBtn.addEventListener("click", async () => {
                const nameInput = document.getElementById("patientNameInput");
                const patientName = nameInput?.value.trim();

                if (!patientName) {
                    alert("Please enter a patient name first.");
                    return;
                }

                try {
                    const res = await fetch(`http://localhost:5000/api/visits/search?name=${encodeURIComponent(patientName)}`);
                    const data = await res.json();

                    if (res.ok && data.records.length > 0) {
                        tableBody.innerHTML = ""; 
                        data.records.forEach(rec => {
                            const date = new Date(rec.B_Date).toLocaleDateString('en-GB'); 
                            const row = document.createElement("tr");
                            // 5 Columns: Date | S.No | Father | Total | Action
                            row.innerHTML = `
                                <td>${date}</td>
                                <td>${rec.B_Sno}</td>
                                <td>${rec.B_FName || '-'}</td>
                                <td>${rec.B_TotalAmt || 0}</td>
                                <td><button type="button" class="select-btn">Select</button></td>
                            `;
                            row.querySelector(".select-btn").onclick = () => {
                                fillForm(rec);
                                toggleEditMode(true); // SWITCH TO EDIT MODE
                                modal.style.display = "none";
                            };
                            tableBody.appendChild(row);
                        });
                        modal.style.display = "flex"; 
                    } else {
                        alert("No history found.");
                    }
                } catch (err) { alert("Error loading history."); }
            });
        }

        function fillForm(record) {
            getEl("patientNameInput").value = record.B_PName || "";
            getEl("fatherNameInput").value = record.B_FName || "";
            (getEl("sex") || form.querySelector("select")).value = record.B_Sex || "";
            (getEl("age") || form.querySelector("#age")).value = record.B_Age || "";
            (getEl("address") || form.querySelector(".address-box")).value = record.B_To || "";
            
            const boxes = form.querySelectorAll(".large-box");
            if (boxes[0]) boxes[0].value = record.B_Perticu1 || "";
            if (boxes[1]) boxes[1].value = record.B_Perticu2 || "";
            
            snoInput.value = record.B_Sno || "";

            if (visitDate && record.B_Date) {
                visitDate.value = new Date(record.B_Date).toISOString().split('T')[0];
            }

            // Fill Billing
            total.value = record.B_PerticuAmt1 || 0;
            cartage.value = record.B_Cart || 0;
            conveyance.value = record.B_Conv || 0;
            grandTotal.value = record.B_TotalAmt || 0;
        }

        /* ================= CRUD OPERATIONS ================= */

        // GET NEXT S.NO
        async function loadNextSno() {
            if (!snoInput) return;
            try {
                const res = await fetch("http://localhost:5000/api/visits/next-sno");
                const data = await res.json();
                if (res.ok) snoInput.value = data.nextSno;
            } catch (err) { console.error(err); }
        }
        
        // GATHER DATA HELPER
        function getPayload() {
            return {
                date: visitDate.value,
                patientName: getEl("patientNameInput").value,
                sex: form.querySelector("select").value,
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

        // 1. SAVE (Create New)
        if (saveBtn) {
            saveBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                saveBtn.disabled = true; saveBtn.innerText = "Saving...";
                try {
                    const res = await fetch("http://localhost:5000/api/visits", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(getPayload())
                    });
                    if (res.ok) { alert("Saved!"); resetForm(); } 
                    else { alert("Save failed."); }
                } catch (err) { alert("Error."); }
                finally { saveBtn.disabled = false; saveBtn.innerText = "Save"; }
            });
        }

        // 2. UPDATE (Edit Existing)
        if (updateBtn) {
            updateBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                const currentSno = snoInput.value;
                if (!currentSno) return;

                updateBtn.disabled = true; updateBtn.innerText = "Updating...";
                try {
                    const res = await fetch(`http://localhost:5000/api/visits/${currentSno}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(getPayload())
                    });
                    if (res.ok) { alert("Updated successfully!"); resetForm(); }
                    else { alert("Update failed."); }
                } catch (err) { alert("Error."); }
                finally { updateBtn.disabled = false; updateBtn.innerText = "Update"; }
            });
        }

        // 3. DELETE (Remove Existing)
        if (deleteBtn) {
            deleteBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                const currentSno = snoInput.value;
                if (!confirm(`Are you sure you want to delete record #${currentSno}?`)) return;

                deleteBtn.disabled = true; deleteBtn.innerText = "Deleting...";
                try {
                    const res = await fetch(`http://localhost:5000/api/visits/${currentSno}`, {
                        method: "DELETE"
                    });
                    if (res.ok) { alert("Deleted successfully!"); resetForm(); }
                    else { alert("Delete failed."); }
                } catch (err) { alert("Error."); }
                finally { deleteBtn.disabled = false; deleteBtn.innerText = "Delete"; }
            });
        }

        // INITIALIZATION
        loadNextSno(); 
        toggleEditMode(false); // Force default state (Save only)
        
        // Initialize date to today if empty
        if(visitDate && !visitDate.value) {
             const now = new Date();
             const year = now.getFullYear();
             const month = String(now.getMonth() + 1).padStart(2, '0');
             const day = String(now.getDate()).padStart(2, '0');
             visitDate.value = `${year}-${month}-${day}`;
        }
    }
    startApp();
})();