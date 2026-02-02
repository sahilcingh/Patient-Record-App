import express from "express";
import { 
    createVisit, 
    getNextSno, 
    searchVisits, 
    updateVisit, 
    getNameSuggestions, 
    getMobileSuggestions, 
    deleteVisit  // Ensure this is imported
} from "../controllers/visits.controller.js";

const router = express.Router();

router.get("/next-sno", getNextSno);
router.get("/suggestions", getNameSuggestions);
router.get("/mobile-suggestions", getMobileSuggestions); // New Route
router.get("/search", searchVisits);
router.post("/", createVisit);
router.put("/:sno", updateVisit);
router.delete("/:sno", deleteVisit); // Route using deleteVisit

export default router;