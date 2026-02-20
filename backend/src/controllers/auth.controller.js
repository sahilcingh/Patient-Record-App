import sql from "mssql";
import jwt from "jsonwebtoken";
import { config } from "../config/db.js";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const pool = await sql.connect(config);

        // 1. Find user in the Pat_User table
        const result = await pool.request()
            .input("Username", sql.VarChar, username)
            .query("SELECT * FROM Pat_User WHERE Username = @Username");
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Doctor not found!" });
        }

        const user = result.recordset[0];

        // 2. Check Password
        if (password !== user.Password) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        // 3. Create Token containing the specific DBName
        const token = jwt.sign(
            { 
                doctorId: user.UserID, 
                doctorName: user.DoctorName, 
                dbName: user.DBName // <--- We now store their database name!
            }, 
            process.env.JWT_SECRET || "my_super_secret_key_123", 
            { expiresIn: "12h" }
        );

        res.json({ message: "Login successful", token, doctorName: user.DoctorName });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
};