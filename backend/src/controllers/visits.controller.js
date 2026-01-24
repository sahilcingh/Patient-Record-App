import { poolPromise } from "../config/db.js";

/* =========================
   TEST DB
========================= */
export const testDb = async (req, res) => {
  try {
    const pool = await poolPromise;
    const db = await pool.request().query("SELECT DB_NAME() AS db");
    res.json({
      success: true,
      database: db.recordset[0].db
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   GET NEXT S.NO (Stand-alone for frontend)
========================= */
export const getNextSno = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query("SELECT ISNULL(MAX(B_Sno), 0) + 1 AS nextSno FROM dbo.Pat_Master1");

    res.json({ nextSno: result.recordset[0].nextSno });
  } catch (err) {
    console.error("Error fetching next S.No:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   SAVE VISIT
========================= */
export const saveVisit = async (req, res) => {
  try {
    const pool = await poolPromise;

    // Get the next serial number
    const bsnoResult = await pool
      .request()
      .query("SELECT ISNULL(MAX(B_Sno), 0) + 1 AS nextBsno FROM dbo.Pat_Master1");

    const nextBsno = bsnoResult.recordset[0].nextBsno;
    const d = req.body;

    await pool.request()
      .input("B_Sno", nextBsno)
      .input("B_Date", d.date)
      .input("B_PName", d.patientName)
      .input("B_FName", d.fatherName)
      .input("B_Sex", d.sex)
      .input("B_Age", d.age)
      .input("B_To", d.address)
      .input("B_Perticu1", d.chiefComplaint)
      .input("B_Perticu2", d.medicine)
      .input("B_PerticuAmt1", d.total || 0)
      .input("B_Cart", d.cartage || 0)
      .input("B_Conv", d.conveyance || 0)
      .input("B_TotalAmt", d.grandTotal || 0)
      .query(`
        INSERT INTO dbo.Pat_Master1
        (
          B_Sno, B_Date, B_PName, B_FName, B_Sex, B_Age,
          B_To, B_Perticu1, B_Perticu2,
          B_PerticuAmt1, B_Cart, B_Conv, B_TotalAmt
        )
        VALUES
        (
          @B_Sno, @B_Date, @B_PName, @B_FName, @B_Sex, @B_Age,
          @B_To, @B_Perticu1, @B_Perticu2,
          @B_PerticuAmt1, @B_Cart, @B_Conv, @B_TotalAmt
        )
      `);

    res.json({
      success: true,
      message: "Visit saved successfully",
      B_Sno: nextBsno
    });

  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ error: err.message });
  }
};