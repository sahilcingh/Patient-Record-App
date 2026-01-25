import express from "express";
import { testDb, saveVisit, getNextSno, getOldRecord } from "../controllers/visits.controller.js";

const router = express.Router();

// This matches the fetch(".../api/visits/next-sno") in your app.js
router.get("/next-sno", getNextSno); 

router.get("/test", testDb);
router.post("/", saveVisit);
router.get("/search", getOldRecord);

export default router;