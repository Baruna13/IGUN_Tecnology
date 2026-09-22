import { useQuery } from "@tanstack/react-query";
import { fetchBoundaries, fetchSchools } from "../api/schoolsApi";

export function useSchoolsQuery() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: fetchSchools,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBoundariesQuery() {
  return useQuery({
    queryKey: ["boundaries"],
    queryFn: fetchBoundaries,
    staleTime: 5 * 60 * 1000,
  });
}
