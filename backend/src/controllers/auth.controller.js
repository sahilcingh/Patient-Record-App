// import sql from "mssql";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { config } from "../config/db.js";

// // Register a new Doctor (You can use this to create your first accounts)
// export const register = async (req, res) => {
//     try {
//         const { username, password, doctorName } = req.body;
//         const pool = await sql.connect(config);

//         // Check if username exists
//         const userCheck = await pool.request().input("Username", sql.VarChar, username).query("SELECT * FROM Doctors WHERE Username = @Username");
//         if (userCheck.recordset.length > 0) return res.status(400).json({ message: "Username already exists" });

//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Save to DB
//         await pool.request()
//             .input("Username", sql.VarChar, username)
//             .input("PasswordHash", sql.VarChar, hashedPassword)
//             .input("DoctorName", sql.VarChar, doctorName)
//             .query("INSERT INTO Doctors (Username, PasswordHash, DoctorName) VALUES (@Username, @PasswordHash, @DoctorName)");

//         res.status(201).json({ message: "Doctor registered successfully!" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error during registration." });
//     }
// };

// // Login an existing Doctor
// export const login = async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const pool = await sql.connect(config);

//         // Find doctor by username
//         const result = await pool.request().input("Username", sql.VarChar, username).query("SELECT * FROM Doctors WHERE Username = @Username");
//         if (result.recordset.length === 0) return res.status(404).json({ message: "Doctor not found!" });

//         const doctor = result.recordset[0];

//         // Check password
//         const isMatch = await bcrypt.compare(password, doctor.PasswordHash);
//         if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

//         // Create Token
//         const token = jwt.sign(
//             { doctorId: doctor.DoctorID, doctorName: doctor.DoctorName }, 
//             process.env.JWT_SECRET || "my_super_secret_key_123", 
//             { expiresIn: "12h" } // Token expires in 12 hours
//         );

//         res.json({ message: "Login successful", token, doctorName: doctor.DoctorName });
//     } catch (error) {
//         res.status(500).json({ message: "Server error during login." });
//     }
// };

import sql from "mssql";
import jwt from "jsonwebtoken";
import { config } from "../config/db.js";

// Login an existing Doctor directly using plain text password from DB
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const pool = await sql.connect(config);

        // Find doctor by username
        const result = await pool.request()
            .input("Username", sql.VarChar, username)
            .query("SELECT * FROM Doctors WHERE Username = @Username");
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Doctor not found!" });
        }

        const doctor = result.recordset[0];

        // Direct matching of password (Plain text)
        if (password !== doctor.PasswordHash) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        // Create Token for the session
        const token = jwt.sign(
            { doctorId: doctor.DoctorID, doctorName: doctor.DoctorName }, 
            process.env.JWT_SECRET || "my_super_secret_key_123", 
            { expiresIn: "12h" } // Token expires in 12 hours
        );

        res.json({ message: "Login successful", token, doctorName: doctor.DoctorName });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
};