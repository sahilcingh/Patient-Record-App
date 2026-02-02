import express from "express";
import { 
    createVisit, 
    getNextSno, 
    searchVisits, 
    updateVisit, 
    getNameSuggestions, 
    getMobileSuggestions, 
    deleteVisit,
    getAllPatients // Import the new function
} from "../controllers/visits.controller.js";

const router = express.Router();

router.get("/next-sno", getNextSno);
router.get("/suggestions", getNameSuggestions);
router.get("/mobile-suggestions", getMobileSuggestions);
router.get("/search", searchVisits);
router.get("/all-patients", getAllPatients); // NEW ROUTE
router.post("/", createVisit);
router.put("/:sno", updateVisit);
router.delete("/:sno", deleteVisit);

export default router;