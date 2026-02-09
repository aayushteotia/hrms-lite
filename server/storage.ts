import { db } from "./db";
import {
  employees,
  attendance,
  type Employee,
  type InsertEmployee,
  type UpdateEmployeeRequest,
  type AttendanceRecord,
  type InsertAttendance,
  type DashboardStats
} from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  // Employee Operations
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeByEmail(email: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, updates: UpdateEmployeeRequest): Promise<Employee>;
  deleteEmployee(id: number): Promise<void>;

  // Attendance Operations
  markAttendance(record: InsertAttendance): Promise<AttendanceRecord>;
  getAttendanceByEmployee(employeeId: number): Promise<AttendanceRecord[]>;
  
  // Stats
  getDashboardStats(): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees).orderBy(employees.name);
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee;
  }

  async getEmployeeByEmail(email: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.email, email));
    return employee;
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const [employee] = await db.insert(employees).values(insertEmployee).returning();
    return employee;
  }

  async updateEmployee(id: number, updates: UpdateEmployeeRequest): Promise<Employee> {
    const [updated] = await db.update(employees)
      .set(updates)
      .where(eq(employees.id, id))
      .returning();
    return updated;
  }

  async deleteEmployee(id: number): Promise<void> {
    // First delete related attendance records to satisfy foreign key constraints
    await db.delete(attendance).where(eq(attendance.employeeId, id));
    await db.delete(employees).where(eq(employees.id, id));
  }

  async markAttendance(record: InsertAttendance): Promise<AttendanceRecord> {
    // Check if attendance already exists for this employee on this date
    // If so, update it, otherwise insert
    const [existing] = await db.select()
      .from(attendance)
      .where(
        and(
          eq(attendance.employeeId, record.employeeId),
          eq(attendance.date, record.date)
        )
      );

    if (existing) {
      const [updated] = await db.update(attendance)
        .set({ status: record.status })
        .where(eq(attendance.id, existing.id))
        .returning();
      return updated;
    }

    const [newRecord] = await db.insert(attendance).values(record).returning();
    return newRecord;
  }

  async getAttendanceByEmployee(employeeId: number): Promise<AttendanceRecord[]> {
    return await db.select()
      .from(attendance)
      .where(eq(attendance.employeeId, employeeId))
      .orderBy(sql`${attendance.date} DESC`);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [employeeCount] = await db.select({ count: sql<number>`count(*)` }).from(employees);
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    const [presentCount] = await db.select({ count: sql<number>`count(*)` })
      .from(attendance)
      .where(
        and(
          eq(attendance.date, today),
          eq(attendance.status, 'Present')
        )
      );

    return {
      totalEmployees: Number(employeeCount?.count || 0),
      presentToday: Number(presentCount?.count || 0),
    };
  }
}

export const storage = new DatabaseStorage();
