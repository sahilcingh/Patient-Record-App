import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import visitsRoutes from "./routes/visits.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ROUTES */
app.use("/api/visits", visitsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
