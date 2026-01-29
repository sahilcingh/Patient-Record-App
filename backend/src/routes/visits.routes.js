import { Router } from "express";
import { 
  createVisit, 
  getNextSno, 
  getVisitBySno, 
  updateVisit, 
  deleteVisit, 
  searchVisits,
  getNameSuggestions // <--- Import this
} from "../controllers/visits.controller.js";

const router = Router();

router.post("/", createVisit);
router.get("/next-sno", getNextSno);
router.get("/search", searchVisits);
router.get("/suggestions", getNameSuggestions); // <--- Add this NEW route
router.get("/:sno", getVisitBySno);
router.put("/:sno", updateVisit);
router.delete("/:sno", deleteVisit);

export default router;