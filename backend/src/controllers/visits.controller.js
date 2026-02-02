import sql from "mssql";
import { config } from "../config/db.js";

// 1. SAVE: Include B_Mobile in Insert
export const createVisit = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { 
        date, patientName, sex, fatherName, mobile, age, address, 
        chiefComplaint, medicine, total, cartage, conveyance, grandTotal 
    } = req.body;

    // Generate next Sno
    const result = await pool.request().query("SELECT MAX(B_Sno) as maxSno FROM Pat_Master");
    const nextSno = (result.recordset[0].maxSno || 0) + 1;

    await pool.request()
      .input("B_Sno", sql.Int, nextSno)
      .input("B_Date", sql.DateTime, date)
      .input("B_PName", sql.VarChar, patientName)
      .input("B_Sex", sql.VarChar, sex)
      .input("B_FName", sql.VarChar, fatherName)
      .input("B_Mobile", sql.VarChar, mobile || "") // Save Mobile
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

// 2. SEARCH: Find by Name OR Mobile
export const searchVisits = async (req, res) => {
    try {
      const { name, mobile } = req.query; 
      const pool = await sql.connect(config);
      
      let query = "SELECT * FROM Pat_Master WHERE 1=1";
      const reqSql = pool.request();

      // If searching by Name
      if(name) {
          query += " AND B_PName LIKE @name";
          reqSql.input("name", sql.VarChar, `%${name}%`);
      }
      
      // If searching by Mobile (Exact Match)
      if(mobile) {
          query += " AND B_Mobile = @mobile";
          reqSql.input("mobile", sql.VarChar, mobile);
      }

      query += " ORDER BY B_Date DESC"; // Get latest record first

      const result = await reqSql.query(query);
      res.json({ records: result.recordset });
    } catch (error) { 
      console.error("Search Error:", error);
      res.status(500).json({ message: "Search failed" }); 
    }
};

// 3. UPDATE: Include B_Mobile in Update
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
        .input("B_Mobile", sql.VarChar, mobile || "") // Update Mobile
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