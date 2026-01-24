import { useState } from "react";

export default function PatientForm() {
  const [formData, setFormData] = useState({
    date: "",
    patientName: "",
    fatherName: "",
    sex: "Male",
    age: "",
    address: "",
    chiefComplaint: "",
    medicine: "",
    total: 0,
    cartage: 0,
    conveyance: 0,
    grandTotal: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    console.log("🔥 SAVE CLICKED", formData);

    const res = await fetch("http://localhost:5000/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    console.log("✅ RESPONSE:", data);

    alert(`Saved. B_Sno: ${data.B_Sno}`);
  };

  return (
    <form onSubmit={handleSave}>
      <input name="date" type="date" onChange={handleChange} />
      <input name="patientName" placeholder="Patient Name" onChange={handleChange} />
      <input name="fatherName" placeholder="Father Name" onChange={handleChange} />
      <input name="age" type="number" placeholder="Age" onChange={handleChange} />

      {/* THIS BUTTON IS CRITICAL */}
      <button type="submit">Save</button>
    </form>
  );
}
