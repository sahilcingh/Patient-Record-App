(function initPatientForm() {
    const getEl = (id) => document.getElementById(id);

    async function startApp() {
        const form = getEl("patientForm");
        if (!form) {
            setTimeout(startApp, 100);
            return;
        }

        if (form.dataset.initialized === "true") return;
        form.dataset.initialized = "true";

        const snoInput = getEl("sno");
        const total = getEl("total");
        const cartage = getEl("cartage");
        const conveyance = getEl("conveyance");
        const grandTotal = getEl("grandTotal");
        const visitDate = getEl("visitDate");
        const saveBtn = form.querySelector('button[type="submit"]');
        const oldRecordBtn = getEl("oldRecordBtn");

        const billingFields = [total, cartage, conveyance].filter(Boolean);

        /* ================= 1. NAVIGATION ================= */
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

        /* ================= 2. BILLING LOGIC ================= */
        function calculateGrandTotal() {
            const t = parseFloat(total?.value) || 0;
            const c = parseFloat(cartage?.value) || 0;
            const v = parseFloat(conveyance?.value) || 0;
            if (grandTotal) grandTotal.value = (t + c + v).toFixed(2);
        }

        billingFields.forEach(field => {
            field.addEventListener("focus", () => { if (field.value === "0") field.value = ""; });
            field.addEventListener("blur", () => {
                if (field.value.trim() === "") field.value = "0";
                calculateGrandTotal();
            });
            field.addEventListener("input", calculateGrandTotal);
        });

        /* ================= 3. MODAL HISTORY & FILL LOGIC ================= */
        if (oldRecordBtn) {
            oldRecordBtn.addEventListener("click", async () => {
                // BUG FIX: Aggressive selector to find the name even if React re-renders
                const nameInput = document.getElementById("patientNameInput") || 
                                  document.querySelector("input[name='patientName']") || 
                                  document.querySelector("input[placeholder*='patient name']");
                
                const patientName = nameInput?.value.trim();

                if (!patientName) {
                    alert("Please enter a patient name to view history.");
                    return;
                }

                try {
                    const response = await fetch(`http://localhost:5000/api/visits/search?name=${encodeURIComponent(patientName)}`);
                    const data = await response.json();

                    if (response.ok && data.records.length > 0) {
                        const modal = getEl("historyModal");
                        const tableBody = getEl("historyTableBody");
                        tableBody.innerHTML = ""; 

                        data.records.forEach(rec => {
                            const date = new Date(rec.B_Date).toLocaleDateString('en-GB'); 
                            const row = document.createElement("tr");
                            row.innerHTML = `
                                <td>${date}</td>
                                <td>${rec.B_Sno}</td>
                                <td><button type="button" class="select-btn">Select</button></td>
                            `;
                            
                            row.querySelector(".select-btn").onclick = () => {
                                fillForm(rec);
                                modal.style.display = "none";
                            };
                            tableBody.appendChild(row);
                        });
                        modal.style.display = "flex"; 
                    } else {
                        alert("No history found for this patient.");
                    }
                } catch (err) {
                    alert("Error loading history.");
                }
            });
        }

        function fillForm(record) {
            const nameField = document.getElementById("patientNameInput") || document.querySelector("input[name='patientName']");
            const fatherField = document.getElementById("fatherNameInput") || document.querySelector("input[name='fatherName']");
            const sexSelect = form.querySelector("select");
            const ageInput = form.querySelector("input[type='number']");
            const addressBox = form.querySelector(".address-box");
            const boxes = form.querySelectorAll(".large-box");

            if (nameField) nameField.value = record.B_PName || ""; 
            if (fatherField) fatherField.value = record.B_FName || ""; 
            if (sexSelect) sexSelect.value = record.B_Sex || "";
            if (ageInput) ageInput.value = record.B_Age || "";
            if (addressBox) addressBox.value = record.B_To || "";
            if (boxes[0]) boxes[0].value = record.B_Perticu1 || "";
            if (boxes[1]) boxes[1].value = record.B_Perticu2 || "";
            if (snoInput) snoInput.value = record.B_Sno || "";

            const dateEl = getEl("visitDate");
            if (dateEl && record.B_Date) {
                const d = new Date(record.B_Date);
                dateEl.value = d.toISOString().split('T')[0];
            }
        }

        /* ================= 4. AUTO-INCREMENT S.NO ================= */
        async function loadNextSno() {
            if (!snoInput) return;
            try {
                const res = await fetch("http://localhost:5000/api/visits/next-sno");
                const data = await res.json();
                if (res.ok && data.nextSno !== undefined) snoInput.value = data.nextSno;
            } catch (err) { console.error("S.No Load Error:", err); }
        }
        loadNextSno();

        /* ================= 5. SAVE VISIT ================= */
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (saveBtn) { saveBtn.disabled = true; saveBtn.innerText = "Saving..."; }

            const pNameField = document.getElementById("patientNameInput") || document.querySelector("input[name='patientName']");
            const fNameField = document.getElementById("fatherNameInput") || document.querySelector("input[name='fatherName']");

            const payload = {
                date: visitDate.value,
                patientName: pNameField?.value || "",
                sex: form.querySelector("select").value,
                fatherName: fNameField?.value || "", 
                age: form.querySelector("input[type='number']").value,
                address: form.querySelector(".address-box").value,
                chiefComplaint: form.querySelectorAll(".large-box")[0].value,
                medicine: form.querySelectorAll(".large-box")[1].value,
                total: total.value,
                cartage: cartage.value,
                conveyance: conveyance.value,
                grandTotal: grandTotal.value
            };

            try {
                const res = await fetch("http://localhost:5000/api/visits", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    alert("Record saved successfully!");
                    form.reset();
                    billingFields.forEach(f => f.value = "0");
                    calculateGrandTotal();
                    await loadNextSno(); 
                }
            } catch (err) { alert("Save failed."); }
            finally { if (saveBtn) { saveBtn.disabled = false; saveBtn.innerText = "Save"; } }
        });
    }
    startApp();
})();