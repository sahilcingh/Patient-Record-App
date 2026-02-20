import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import visitsRoutes from "./routes/visits.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// CORS: Allow connections from local and live Vercel domains
app.use(cors({
    origin: ["http://localhost:5173", "https://patient-record-app.vercel.app"], 
    credentials: true
}));

app.use(express.json());

/* ROUTES */
app.use("/api/auth", authRoutes); 
app.use("/api/visits", visitsRoutes); // Only need this line once, using the exact imported name

// RENDER: Uses process.env.PORT, Localhost uses 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});