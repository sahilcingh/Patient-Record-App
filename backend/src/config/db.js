import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,          // for cloud (Azure / RDS)
    trustServerCertificate: true
  }
};

export const poolPromise = sql.connect(config);
