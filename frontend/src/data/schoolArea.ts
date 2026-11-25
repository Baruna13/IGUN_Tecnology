import { buildAreaBuffer } from "../services/spatialAnalysis";
import { KOTA_BOGOR_BOUNDARY } from "./kotaBogorBoundary";

/** How far past the edge of Kota Bogor schools are still shown, in meters. */
export const SCHOOL_AREA_MARGIN_METERS = 6000;

/** Kota Bogor's outline pushed out by the margin. Schools outside it are hidden everywhere in the app. */
export const SCHOOL_AREA = buildAreaBuffer(KOTA_BOGOR_BOUNDARY, SCHOOL_AREA_MARGIN_METERS);
