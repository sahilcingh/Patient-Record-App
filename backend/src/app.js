import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import visitsRoutes from "./routes/visits.routes.js";

dotenv.config();

const app = express();

// Allow Vercel frontend to access this backend
app.use(cors({
  origin: "*", 
  credentials: true
}));

app.use(express.json());

/* ROUTES */
app.use("/api/visits", visitsRoutes);

// Simple Health Check Route (Good for testing)
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

// CRITICAL CHANGE: Only start the server manually if we are NOT in production.
// Vercel will handle starting the server automatically.
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

// Export the app so Vercel can treat it as a Serverless Function
export default app;