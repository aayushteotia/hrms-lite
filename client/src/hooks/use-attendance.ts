import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { InsertAttendance } from "@shared/schema";

export function useStats() {
  return useQuery({
    queryKey: [api.attendance.stats.path],
    queryFn: async () => {
      const res = await fetch(api.attendance.stats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.attendance.stats.responses[200].parse(await res.json());
    },
  });
}

export function useEmployeeAttendance(employeeId: number | null) {
  return useQuery({
    queryKey: [api.attendance.getByEmployee.path, employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      if (!employeeId) throw new Error("Employee ID required");
      const url = buildUrl(api.attendance.getByEmployee.path, { id: employeeId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 404) return [];
        throw new Error("Failed to fetch attendance history");
      }
      return api.attendance.getByEmployee.responses[200].parse(await res.json());
    },
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertAttendance) => {
      const res = await fetch(api.attendance.mark.path, {
        method: api.attendance.mark.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to mark attendance");
      }
      return api.attendance.mark.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate specific employee attendance and global stats
      queryClient.invalidateQueries({ 
        queryKey: [api.attendance.getByEmployee.path, variables.employeeId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [api.attendance.stats.path] 
      });
      
      toast({
        title: "Success",
        description: "Attendance marked successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
