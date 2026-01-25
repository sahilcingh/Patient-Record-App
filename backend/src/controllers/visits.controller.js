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
   GET NEXT S.NO (Now pulling from B_Sno)
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
   GET OLD RECORD BY NAME OR S.NO (Returns List for Modal)
========================= */
export const getOldRecord = async (req, res) => {
  try {
    const { name, sno } = req.query;
    const pool = await poolPromise;
    let query = "";
    const request = pool.request();

    if (sno) {
      // Search specifically by the visible Serial Number
      request.input("sno", sno);
      query = "SELECT * FROM dbo.Pat_Master1 WHERE B_Sno = @sno";
    } else {
      // Search all visits for this name, ordered newest to oldest
      request.input("patientName", name);
      query = "SELECT * FROM dbo.Pat_Master1 WHERE B_PName = @patientName ORDER BY B_Date DESC, B_Sno DESC";
    }

    const result = await request.query(query);
    res.json({ success: true, records: result.recordset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   SAVE VISIT
========================= */
export const saveVisit = async (req, res) => {
  try {
    const pool = await poolPromise;

    // Get the next serial number based on B_Sno
    const bsnoResult = await pool
      .request()
      .query("SELECT ISNULL(MAX(B_Sno), 0) + 1 AS nextBsno FROM dbo.Pat_Master1");

    const nextBsno = bsnoResult.recordset[0].nextBsno;
    const d = req.body;

    await pool.request()
      .input("sno", nextBsno)             // Inserting B_Sno value into 'sno' column to keep them synced
      .input("B_Sno", nextBsno)           // Our primary incremental counter
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
          sno, B_Sno, B_Date, B_PName, B_FName, B_Sex, B_Age,
          B_To, B_Perticu1, B_Perticu2,
          B_PerticuAmt1, B_Cart, B_Conv, B_TotalAmt
        )
        VALUES
        (
          @sno, @B_Sno, @B_Date, @B_PName, @B_FName, @B_Sex, @B_Age,
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