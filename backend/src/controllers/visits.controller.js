import { poolPromise } from "../config/db.js";
import sql from "mssql";
import { config } from "../config/db.js";

export const testDb = async (req, res) => {
  try {
    const pool = await poolPromise;
    const db = await pool.request().query("SELECT DB_NAME() AS db");
    res.json({ success: true, database: db.recordset[0].db });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNextSno = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT ISNULL(MAX(B_Sno), 0) + 1 AS nextSno FROM dbo.Pat_Master1");
    res.json({ nextSno: result.recordset[0].nextSno });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOldRecord = async (req, res) => {
  try {
    const { name, sno } = req.query;
    const pool = await poolPromise;
    const request = pool.request();
    let query = "";

    if (sno) {
      request.input("sno", sno);
      query = "SELECT * FROM dbo.Pat_Master1 WHERE B_Sno = @sno";
    } else {
      request.input("patientName", name);
      query = "SELECT * FROM dbo.Pat_Master1 WHERE B_PName = @patientName ORDER BY B_Date DESC, B_Sno DESC";
    }

    const result = await request.query(query);
    res.json({ success: true, records: result.recordset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const saveVisit = async (req, res) => {
  try {
    const pool = await poolPromise;
    const bsnoResult = await pool.request().query("SELECT ISNULL(MAX(B_Sno), 0) + 1 AS nextBsno FROM dbo.Pat_Master1");
    const nextBsno = bsnoResult.recordset[0].nextBsno;
    const d = req.body;

    await pool.request()
      .input("sno", nextBsno)
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
        (sno, B_Sno, B_Date, B_PName, B_FName, B_Sex, B_Age, B_To, B_Perticu1, B_Perticu2, B_PerticuAmt1, B_Cart, B_Conv, B_TotalAmt)
        VALUES
        (@sno, @B_Sno, @B_Date, @B_PName, @B_FName, @B_Sex, @B_Age, @B_To, @B_Perticu1, @B_Perticu2, @B_PerticuAmt1, @B_Cart, @B_Conv, @B_TotalAmt)
      `);

    res.json({ success: true, B_Sno: nextBsno });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= NEW: UPDATE RECORD ================= */
export const updateVisit = async (req, res) => {
  try {
    const { sno } = req.params; // We use B_Sno to identify the record
    const d = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input("targetSno", sno)
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
        UPDATE dbo.Pat_Master1
        SET 
          B_Date = @B_Date,
          B_PName = @B_PName,
          B_FName = @B_FName,
          B_Sex = @B_Sex,
          B_Age = @B_Age,
          B_To = @B_To,
          B_Perticu1 = @B_Perticu1,
          B_Perticu2 = @B_Perticu2,
          B_PerticuAmt1 = @B_PerticuAmt1,
          B_Cart = @B_Cart,
          B_Conv = @B_Conv,
          B_TotalAmt = @B_TotalAmt
        WHERE B_Sno = @targetSno
      `);

    res.json({ success: true, message: "Record updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= NEW: DELETE RECORD ================= */
export const deleteVisit = async (req, res) => {
  try {
    const { sno } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input("targetSno", sno)
      .query("DELETE FROM dbo.Pat_Master1 WHERE B_Sno = @targetSno");

    res.json({ success: true, message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NEW FUNCTION: Real-time Name Search
export const getNameSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const pool = await sql.connect(config);
    
    // Select top 10 unique names starting with the query letters
    const result = await pool.request()
      .input("search", sql.VarChar, `%${query}%`)
      .query(`
        SELECT DISTINCT TOP 10 B_PName 
        FROM Pat_Master1 
        WHERE B_PName LIKE @search + '%' 
        ORDER BY B_PName
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Suggestion Error:", error);
    res.status(500).json({ message: "Error fetching suggestions" });
  }
};