import dotenv from "dotenv";
dotenv.config();

// NOTICE: "export const" is required here, NOT "module.exports" or "export default"
export const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Use true for AWS/Azure
    trustServerCertificate: true // Use true for self-signed certs or local dev
  },
};