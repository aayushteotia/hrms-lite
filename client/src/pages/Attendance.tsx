import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAttendanceSchema, type InsertAttendance } from "@shared/schema";
import { useEmployees } from "@/hooks/use-employees";
import { useMarkAttendance, useEmployeeAttendance } from "@/hooks/use-attendance";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, UserCheck, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Attendance() {
  const { data: employees, isLoading: employeesLoading } = useEmployees();
  const markMutation = useMarkAttendance();
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  
  const { data: history, isLoading: historyLoading } = useEmployeeAttendance(selectedEmployeeId);

  const form = useForm<InsertAttendance>({
    resolver: zodResolver(insertAttendanceSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      status: "Present",
    },
  });

  const onSubmit = (data: InsertAttendance) => {
    markMutation.mutate(data, {
      onSuccess: () => {
        form.reset({
          employeeId: data.employeeId,
          date: new Date().toISOString().split("T")[0],
          status: "Present",
        });
      }
    });
  };

  const handleEmployeeChange = (value: string) => {
    const id = parseInt(value);
    setSelectedEmployeeId(id);
    form.setValue("employeeId", id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present": return "bg-green-100 text-green-700 border-green-200";
      case "Absent": return "bg-red-100 text-red-700 border-red-200";
      case "Leave": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold">Attendance</h2>
        <p className="text-muted-foreground mt-1">Track daily attendance for your team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mark Attendance Form */}
        <div className="lg:col-span-4">
          <Card className="rounded-2xl border-border shadow-sm overflow-hidden h-full">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 font-display">
                <CalendarCheck className="w-5 h-5 text-primary" />
                Mark Attendance
              </CardTitle>
              <CardDescription>Select employee and date</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee</FormLabel>
                        <Select onValueChange={handleEmployeeChange} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl h-11">
                              <SelectValue placeholder={employeesLoading ? "Loading..." : "Select employee"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            {employees?.map((emp) => (
                              <SelectItem key={emp.id} value={emp.id.toString()}>
                                {emp.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="rounded-xl h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl h-11">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="Present">Present</SelectItem>
                            <SelectItem value="Absent">Absent</SelectItem>
                            <SelectItem value="Leave">On Leave</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90 mt-2"
                    disabled={markMutation.isPending}
                  >
                    {markMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <UserCheck className="w-4 h-4 mr-2" />
                    )}
                    Mark Attendance
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* History Section */}
        <div className="lg:col-span-8">
          <Card className="rounded-2xl border-border shadow-sm h-full">
            <CardHeader>
              <CardTitle className="font-display">Recent History</CardTitle>
              <CardDescription>
                {selectedEmployeeId 
                  ? "Showing records for selected employee" 
                  : "Select an employee to view history"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedEmployeeId ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                  <UserCheck className="w-12 h-12 mb-3 opacity-20" />
                  <p>Select an employee from the form<br />to view their attendance record</p>
                </div>
              ) : historyLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : history && history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((record) => (
                    <div 
                      key={record.id} 
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:border-border hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          record.status === 'Present' ? 'bg-green-100 text-green-600' :
                          record.status === 'Absent' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {format(new Date(record.date), 'dd')}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {format(new Date(record.date), 'EEEE, MMMM do, yyyy')}
                          </p>
                          <p className="text-xs text-muted-foreground">Recorded via HR Portal</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`px-3 py-1 rounded-lg ${getStatusColor(record.status)}`}>
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No attendance records found for this employee.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
