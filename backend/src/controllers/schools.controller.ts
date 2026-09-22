import type { Request, Response, NextFunction } from "express";
import type { AdminBoundary } from "@prisma/client";
import { prisma } from "../utils/prisma.js";
import { toSchoolDTO } from "../utils/mappers.js";

export async function listSchools(_req: Request, res: Response, next: NextFunction) {
  try {
    const schools = await prisma.school.findMany({ orderBy: { name: "asc" } });
    res.json({ data: schools.map(toSchoolDTO) });
  } catch (err) {
    next(err);
  }
}

export async function getSchoolById(req: Request, res: Response, next: NextFunction) {
  try {
    const school = await prisma.school.findUnique({ where: { id: req.params.id } });
    if (!school) {
      res.status(404).json({ error: `School ${req.params.id} not found` });
      return;
    }
    res.json({ data: toSchoolDTO(school) });
  } catch (err) {
    next(err);
  }
}

export async function listBoundaries(_req: Request, res: Response, next: NextFunction) {
  try {
    const boundaries = await prisma.adminBoundary.findMany();
    res.json({
      data: {
        type: "FeatureCollection",
        features: boundaries.map((b: AdminBoundary) => ({
          type: "Feature",
          properties: { name: b.name },
          geometry: b.geometry,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
}
