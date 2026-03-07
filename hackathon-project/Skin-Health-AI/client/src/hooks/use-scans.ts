import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// Utility to parse with logging for easier debugging
function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useScans() {
  return useQuery({
    queryKey: [api.scans.list.path],
    queryFn: async () => {
      const res = await fetch(api.scans.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch scans history");
      const data = await res.json();
      return parseWithLogging(api.scans.list.responses[200], data, "scans.list");
    },
  });
}

export function useScan(id: number | null) {
  return useQuery({
    queryKey: [api.scans.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.scans.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch scan details");
      const data = await res.json();
      return parseWithLogging(api.scans.get.responses[200], data, "scans.get");
    },
    enabled: id !== null,
  });
}

export function useAnalyzeScan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (base64Image: string) => {
      const payload = { image: base64Image };
      // Validate input payload before sending
      const validatedInput = api.scans.create.input.parse(payload);
      
      const res = await fetch(api.scans.create.path, {
        method: api.scans.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedInput),
        credentials: "include",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error(data.message || "Invalid image data provided");
        }
        throw new Error(data.message || "Failed to analyze image");
      }
      
      return parseWithLogging(api.scans.create.responses[201], data, "scans.create");
    },
    onSuccess: () => {
      // Invalidate the list so the history page updates
      queryClient.invalidateQueries({ queryKey: [api.scans.list.path] });
    },
  });
}
