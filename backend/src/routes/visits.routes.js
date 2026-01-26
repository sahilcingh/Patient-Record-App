import express from "express";
import { saveVisit, getNextSno, getOldRecord, updateVisit, deleteVisit } from "../controllers/visits.controller.js";

const router = express.Router();

router.get("/next-sno", getNextSno);
router.get("/search", getOldRecord);
router.post("/", saveVisit);
router.put("/:sno", updateVisit);   // Update Route
router.delete("/:sno", deleteVisit); // Delete Route

export default router;