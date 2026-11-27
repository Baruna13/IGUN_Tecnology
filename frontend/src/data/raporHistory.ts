/**
 * Jalur prestasi nilai rapor: final score of the lowest accepted applicant per
 * school. Shown as background only: it never changes the score.
 *
 * - SPMB 2026 (tahun ajaran 2026/27): Databoks (Katadata) "Nilai Minimal Lolos
 *   Jalur Prestasi ke ... SPMB 2026" articles, which report the acceptance list
 *   released by Dinas Pendidikan Provinsi Jawa Barat: the lowest accepted
 *   composite score, total seats over all routes, and applicants over all
 *   routes. The 2026 composite is 50% the average rapor of semesters 1-5 and
 *   50% the standardized test (tes terstandar).
 * - SPMB 2025 (tahun ajaran 2025/26): table published by SMAN 5 Bogor
 *   (sman5kotabogor.sch.id/pages/passing-grade), tahap 2 jalur rapor, lowest
 *   and highest accepted score. Used only for Kota Bogor schools Databoks does
 *   not cover. The 2025 score is on a different scale from 2026.
 * Schools neither source covers have no entry.
 */
export interface RaporResult {
  /** SPMB year label, e.g. "2026/27" */
  year: string;
  low: number;
  /** Highest accepted score (SMAN 5 Bogor table only) */
  high?: number;
  /** Seats and applicants over all SPMB routes (Databoks only) */
  totalSeats?: number;
  applicants?: number;
  source: "Databoks" | "SMAN 5 Bogor";
}

const dbk = (low: number, totalSeats: number, applicants: number): RaporResult => ({
  year: "2026/27",
  low,
  totalSeats,
  applicants,
  source: "Databoks",
});
const sman5 = (low: number, high: number): RaporResult => ({ year: "2025/26", low, high, source: "SMAN 5 Bogor" });

export const RAPOR_RESULTS: Record<string, RaporResult> = {
  // SPMB 2026, Databoks / Disdik Jabar
  "20238517": dbk(307.92, 414, 3486), // SMA Negeri 5 Bogor
  "20220336": dbk(294.3, 459, 1611), // SMA Negeri 7 Bogor
  "20220338": dbk(303.1, 414, 3588), // SMA Negeri 9 Bogor
  "69888996": dbk(286.7, 504, 1357), // SMAN 1 Bojonggede
  "20231324": dbk(287.38, 552, 2884), // SMAN 1 Cibungbulang
  "20231325": dbk(277.23, 552, 2298), // SMAN 1 Cigudeg
  "20232377": dbk(291.38, 552, 2216), // SMAN 1 Dramaga
  "20200680": dbk(285.24, 552, 2267), // SMAN 1 Jonggol
  "20254612": dbk(268.24, 276, 640), // SMAN 1 Nanggung
  "20200887": dbk(272.97, 460, 1180), // SMAN 1 Parung Panjang
  "20200903": dbk(258.57, 368, 885), // SMAN 1 Rumpin
  "20231337": dbk(276.12, 440, 1144), // SMAN 1 Sukaraja
  "20231338": dbk(257.38, 460, 861), // SMAN 1 Tenjo
  "69752279": dbk(275.97, 336, 733), // SMAN 1 Tenjolaya
  "70055745": dbk(282.06, 138, 993), // SMAN 1 Kemang
  // SPMB 2025, SMAN 5 Bogor table (Kota Bogor schools without 2026 data)
  "20220342": sman5(342.11, 380.36), // SMA Negeri 1 Bogor
  "20238516": sman5(322.85, 377.86), // SMA Negeri 2 Bogor
  "20220332": sman5(334.68, 393.5), // SMA Negeri 3 Bogor
  "20220334": sman5(325.23, 365.36), // SMA Negeri 4 Bogor
  "20220335": sman5(322.5, 377.89), // SMA Negeri 6 Bogor
  "20220337": sman5(311, 371.34), // SMA Negeri 8 Bogor
  "20220341": sman5(318.7, 353), // SMA Negeri 10 Bogor
};
