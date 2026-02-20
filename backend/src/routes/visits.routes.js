// import express from "express";
// import { 
//     createVisit, 
//     getNextSno, 
//     searchVisits, 
//     updateVisit, 
//     getNameSuggestions, 
//     getMobileSuggestions, 
//     deleteVisit,
//     getAllPatients // Import the new function
// } from "../controllers/visits.controller.js";

// const router = express.Router();

// router.get("/next-sno", getNextSno);
// router.get("/suggestions", getNameSuggestions);
// router.get("/mobile-suggestions", getMobileSuggestions);
// router.get("/search", searchVisits);
// router.get("/all-patients", getAllPatients); // NEW ROUTE
// router.post("/", createVisit);
// router.put("/:sno", updateVisit);
// router.delete("/:sno", deleteVisit);

// export default router;

import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { 
    createVisit, updateVisit, searchVisits, getNextSno, 
    getNameSuggestions, getMobileSuggestions, getVisitBySno, 
    deleteVisit, getAllPatients 
} from "../controllers/visits.controller.js";

const router = express.Router();

// This single line protects EVERY route below it. 
// It requires a valid JWT token to pass through.
router.use(verifyToken);

router.get("/next-sno", getNextSno);
router.get("/suggestions", getNameSuggestions);
router.get("/mobile-suggestions", getMobileSuggestions);
router.get("/search", searchVisits);
router.get("/all-patients", getAllPatients);
router.get("/:sno", getVisitBySno);
router.post("/", createVisit);
router.put("/:sno", updateVisit);
router.delete("/:sno", deleteVisit);

export default router;