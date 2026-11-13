import { useQuery } from "@tanstack/react-query";
import { fetchSchools } from "../api/schoolsApi";

export function useSchoolsQuery() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: fetchSchools,
    staleTime: 5 * 60 * 1000,
  });
}

