import { Router } from "express";
import { 
  createVisit, 
  getNextSno, 
  searchVisits, 
  getNameSuggestions, 
  getVisitBySno, 
  updateVisit, 
  deleteVisit 
} from "../controllers/visits.controller.js";

const router = Router();

router.post("/", createVisit);
router.get("/next-sno", getNextSno);
router.get("/search", searchVisits);
router.get("/suggestions", getNameSuggestions);
router.get("/:sno", getVisitBySno);
router.put("/:sno", updateVisit);
router.delete("/:sno", deleteVisit);

export default router;