import { Router } from "express";
import { getSchoolById, listBoundaries, listSchools } from "../controllers/schools.controller.js";
import { checkEligibility, getRecommendations } from "../controllers/analysis.controller.js";

export const router = Router();

router.get("/schools", listSchools);
router.get("/schools/:id", getSchoolById);
router.get("/boundaries", listBoundaries);

router.post("/analysis/eligibility", checkEligibility);
router.post("/analysis/recommendations", getRecommendations);
