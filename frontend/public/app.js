(function initPatientForm() {
    const getEl = (id) => document.getElementById(id);

    async function startApp() {
        const form = getEl("patientForm");
        if (!form) {
            setTimeout(startApp, 100);
            return;
        }

        // PREVENT DOUBLE ATTACHMENT: 
        // If we've already initialized this form, don't do it again.
        if (form.dataset.initialized === "true") return;
        form.dataset.initialized = "true";

        const snoInput = getEl("sno");
        const total = getEl("total");
        const cartage = getEl("cartage");
        const conveyance = getEl("conveyance");
        const grandTotal = getEl("grandTotal");
        const visitDate = getEl("visitDate");
        const saveBtn = form.querySelector('button[type="submit"]');

        const billingFields = [total, cartage, conveyance].filter(Boolean);

        /* ================= 1. NAVIGATION LOGIC ================= */
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

        /* ================= 3. S.NO LOGIC ================= */
        async function loadNextSno() {
            try {
                const res = await fetch("http://localhost:5000/api/visits/next-sno");
                const data = await res.json();
                const val = data.nextSno || data.next_sno;
                if (res.ok && val !== undefined) snoInput.value = val;
            } catch (err) { console.error("S.No Load Error:", err); }
        }
        loadNextSno();

        /* ================= 4. SAVE LOGIC (FIXED DOUBLE SAVE) ================= */
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // Stops other scripts from catching this event

            // Disable button to prevent multiple clicks
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerText = "Saving...";
            }

            const payload = {
                date: visitDate.value,
                patientName: form.querySelector("input[placeholder='Enter patient name']").value,
                sex: form.querySelector("select").value,
                fatherName: form.querySelectorAll("input[type='text']")[1].value, 
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
                } else {
                    alert("Save failed.");
                }
            } catch (err) { 
                alert("Server error."); 
            } finally {
                // Re-enable button after process is complete
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.innerText = "Save";
                }
            }
        });
    }
    startApp();
})();