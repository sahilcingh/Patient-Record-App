import sql from "mssql";
import { config } from "../config/db.js";

// 1. CREATE VISIT
export const createVisit = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { 
        date, patientName, sex, fatherName, mobile, age, address, 
        chiefComplaint, medicine, total, cartage, conveyance, grandTotal 
    } = req.body;

    const result = await pool.request().query("SELECT MAX(B_Sno) as maxSno FROM Pat_Master");
    const nextSno = (result.recordset[0].maxSno || 0) + 1;

    await pool.request()
      .input("B_Sno", sql.Int, nextSno)
      .input("B_Date", sql.DateTime, date)
      .input("B_PName", sql.VarChar, patientName)
      .input("B_Sex", sql.VarChar, sex)
      .input("B_FName", sql.VarChar, fatherName)
      .input("B_Mobile", sql.VarChar, mobile || "") // NEW FIELD
      .input("B_Age", sql.VarChar, age)
      .input("B_To", sql.VarChar, address)
      .input("B_Perticu1", sql.VarChar, chiefComplaint)
      .input("B_Perticu2", sql.VarChar, medicine)
      .input("B_PerticuAmt1", sql.Decimal(10, 2), total)
      .input("B_Cart", sql.Decimal(10, 2), cartage)
      .input("B_Conv", sql.Decimal(10, 2), conveyance)
      .input("B_TotalAmt", sql.Decimal(10, 2), grandTotal)
      .query(`
        INSERT INTO Pat_Master (
          B_Sno, B_Date, B_PName, B_Sex, B_FName, B_Mobile, B_Age, B_To, 
          B_Perticu1, B_Perticu2, B_PerticuAmt1, B_Cart, B_Conv, B_TotalAmt
        ) VALUES (
          @B_Sno, @B_Date, @B_PName, @B_Sex, @B_FName, @B_Mobile, @B_Age, @B_To, 
          @B_Perticu1, @B_Perticu2, @B_PerticuAmt1, @B_Cart, @B_Conv, @B_TotalAmt
        )
      `);

    res.status(201).json({ message: "Visit created successfully", sno: nextSno });
  } catch (error) {
    console.error("Error creating visit:", error);
    res.status(500).json({ message: "Error creating visit" });
  }
};

// 2. UPDATE VISIT
export const updateVisit = async (req, res) => {
    try {
      const { sno } = req.params;
      const { 
          date, patientName, sex, fatherName, mobile, age, address, 
          chiefComplaint, medicine, total, cartage, conveyance, grandTotal 
      } = req.body;
  
      const pool = await sql.connect(config);
      await pool.request()
        .input("B_Sno", sql.Int, sno)
        .input("B_Date", sql.DateTime, date)
        .input("B_PName", sql.VarChar, patientName)
        .input("B_Sex", sql.VarChar, sex)
        .input("B_FName", sql.VarChar, fatherName)
        .input("B_Mobile", sql.VarChar, mobile || "") // NEW
        .input("B_Age", sql.VarChar, age)
        .input("B_To", sql.VarChar, address)
        .input("B_Perticu1", sql.VarChar, chiefComplaint)
        .input("B_Perticu2", sql.VarChar, medicine)
        .input("B_PerticuAmt1", sql.Decimal(10, 2), total)
        .input("B_Cart", sql.Decimal(10, 2), cartage)
        .input("B_Conv", sql.Decimal(10, 2), conveyance)
        .input("B_TotalAmt", sql.Decimal(10, 2), grandTotal)
        .query(`
          UPDATE Pat_Master SET 
            B_Date=@B_Date, B_PName=@B_PName, B_Sex=@B_Sex, B_FName=@B_FName, B_Mobile=@B_Mobile,
            B_Age=@B_Age, B_To=@B_To, B_Perticu1=@B_Perticu1, B_Perticu2=@B_Perticu2, 
            B_PerticuAmt1=@B_PerticuAmt1, B_Cart=@B_Cart, B_Conv=@B_Conv, B_TotalAmt=@B_TotalAmt
          WHERE B_Sno = @B_Sno
        `);
  
      res.json({ message: "Visit updated successfully" });
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ message: "Error updating visit" });
    }
};

// ... (Rest of the controller functions: getNextSno, searchVisits, etc. remain the same) ...
export const getNextSno = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT MAX(B_Sno) as maxSno FROM Pat_Master");
    const nextSno = (result.recordset[0].maxSno || 0) + 1;
    res.json({ nextSno });
  } catch (error) {
    res.status(500).json({ message: "Error fetching next S.No" });
  }
};

export const searchVisits = async (req, res) => {
    try {
      const { name } = req.query;
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input("name", sql.VarChar, `%${name}%`)
        .query("SELECT * FROM Pat_Master WHERE B_PName LIKE @name ORDER BY B_Date DESC");
      res.json({ records: result.recordset });
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
};

export const getNameSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("search", sql.VarChar, `${query}%`)
      .query(`SELECT DISTINCT TOP 10 B_PName FROM Pat_Master WHERE B_PName LIKE @search ORDER BY B_PName`);
    res.json(result.recordset);
  } catch (error) {
    console.error("Suggestion Error:", error);
    res.status(500).json({ message: "Error fetching suggestions" });
  }
};

export const getVisitBySno = async (req, res) => {
    try {
      const { sno } = req.params;
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input("sno", sql.Int, sno)
        .query("SELECT * FROM Pat_Master WHERE B_Sno = @sno");
      if (result.recordset.length === 0) return res.status(404).json({ message: "Visit not found" });
      res.json(result.recordset[0]);
    } catch (error) {
      res.status(500).json({ message: "Error fetching visit" });
    }
  };

export const deleteVisit = async (req, res) => {
    try {
      const { sno } = req.params;
      const pool = await sql.connect(config);
      await pool.request().input("sno", sql.Int, sno).query("DELETE FROM Pat_Master WHERE B_Sno = @sno");
      res.json({ message: "Visit deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting visit" });
    }
};