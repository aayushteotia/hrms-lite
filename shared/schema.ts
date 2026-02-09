import { pgTable, text, serial, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  department: text("department").notNull(),
  role: text("role").notNull(),
  joiningDate: date("joining_date").notNull(), // Using date type for simplified date handling
  createdAt: timestamp("created_at").defaultNow(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  employeeId: serial("employee_id").references(() => employees.id),
  date: date("date").notNull(), // YYYY-MM-DD
  status: text("status", { enum: ["Present", "Absent", "Leave"] }).notNull(),
});

// === RELATIONS ===

export const employeesRelations = relations(employees, ({ many }) => ({
  attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(employees, {
    fields: [attendance.employeeId],
    references: [employees.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertEmployeeSchema = createInsertSchema(employees).omit({ 
  id: true, 
  createdAt: true 
}).extend({
  email: z.string().email("Invalid email format"),
  joiningDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({ 
  id: true 
});

// === EXPLICIT API CONTRACT TYPES ===

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type AttendanceRecord = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

// Request types
export type CreateEmployeeRequest = InsertEmployee;
export type UpdateEmployeeRequest = Partial<InsertEmployee>;
export type MarkAttendanceRequest = InsertAttendance;

// Response types
export type EmployeeResponse = Employee;
export type AttendanceResponse = AttendanceRecord;

// Dashboard Stats
export type DashboardStats = {
  totalEmployees: number;
  presentToday: number;
};
