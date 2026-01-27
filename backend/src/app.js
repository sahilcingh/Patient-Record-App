import express from "express";
import cors from "cors";
import visitsRoutes from "./routes/visits.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/visits", visitsRoutes);

export default app;
