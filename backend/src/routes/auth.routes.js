import express from "express";
import { login } from "../controllers/auth.controller.js";

const router = express.Router();

// Only the login route is needed now
router.post("/login", login);

export default router;