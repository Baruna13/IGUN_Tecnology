/**
 * Past zonasi results: how far from the school the farthest accepted
 * applicant lived. Shown as background only: it never changes the score.
 *
 * - SMAN 1-10 Bogor: PPDB 2024/2025 tahap 1, from the table published by
 *   SMAN 5 Bogor (sman5kotabogor.sch.id/pages/passing-grade).
 * - SMAN 2 Cibinong: "kemarin itu di 1,2 kilo meter", said by the school's
 *   PPDB information officer about PPDB 2023/2024 (Tribun Bogor, 6 June 2024).
 *   A rounded spoken figure, so it is marked approximate.
 */
export interface ZonasiCutoff {
  meters: number;
  year: string;
  approximate?: boolean;
}

export const ZONASI_CUTOFFS: Record<string, ZonasiCutoff> = {
  "20220342": { meters: 780, year: "2024/25" }, // SMAN 1 Bogor
  "20238516": { meters: 698, year: "2024/25" }, // SMAN 2 Bogor
  "20220332": { meters: 709, year: "2024/25" }, // SMAN 3 Bogor
  "20220334": { meters: 636, year: "2024/25" }, // SMAN 4 Bogor
  "20238517": { meters: 643, year: "2024/25" }, // SMAN 5 Bogor
  "20220335": { meters: 745, year: "2024/25" }, // SMAN 6 Bogor
  "20220336": { meters: 985, year: "2024/25" }, // SMAN 7 Bogor
  "20220337": { meters: 732, year: "2024/25" }, // SMAN 8 Bogor
  "20220338": { meters: 700, year: "2024/25" }, // SMAN 9 Bogor
  "20220341": { meters: 646, year: "2024/25" }, // SMAN 10 Bogor
  "20200691": { meters: 1200, year: "2023/24", approximate: true }, // SMAN 2 Cibinong
};
