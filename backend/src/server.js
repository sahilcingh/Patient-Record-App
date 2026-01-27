import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import visitsRoutes from "./routes/visits.routes.js";

dotenv.config();

const app = express();

// CORS: Allow connections from anywhere (including Vercel)
app.use(cors({
    origin: "https://patient-record-app.vercel.app", 
    credentials: true
}));

app.use(express.json());

/* ROUTES */
app.use("/api/visits", visitsRoutes);

// RENDER: Uses process.env.PORT, Localhost uses 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});