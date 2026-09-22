import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { toSchoolDTO } from "../utils/mappers.js";
import { evaluateEligibility, recommendSchools } from "../services/spatialAnalysis.js";

const eligibilitySchema = z.object({
  schoolId: z.string().min(1),
  homeLng: z.coerce.number(),
  homeLat: z.coerce.number(),
  radiusMeters: z.coerce.number().min(100).max(10000).optional(),
});

export async function checkEligibility(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = eligibilitySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
      return;
    }
    const { schoolId, homeLng, homeLat, radiusMeters } = parsed.data;

    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) {
      res.status(404).json({ error: `School ${schoolId} not found` });
      return;
    }

    const result = evaluateEligibility([homeLng, homeLat], toSchoolDTO(school), radiusMeters);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

const recommendationsSchema = z.object({
  homeLng: z.coerce.number(),
  homeLat: z.coerce.number(),
  excludeSchoolId: z.string().optional(),
  limit: z.coerce.number().min(1).max(10).optional(),
});

export async function getRecommendations(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = recommendationsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
      return;
    }
    const { homeLng, homeLat, excludeSchoolId, limit } = parsed.data;

    const schools = await prisma.school.findMany();
    const result = recommendSchools(
      [homeLng, homeLat],
      schools.map(toSchoolDTO),
      excludeSchoolId,
      limit ?? 3
    );
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}
