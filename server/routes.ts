import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Employee Routes ===

  app.get(api.employees.list.path, async (req, res) => {
    const employees = await storage.getEmployees();
    res.json(employees);
  });

  app.get(api.employees.get.path, async (req, res) => {
    const employee = await storage.getEmployee(Number(req.params.id));
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  });

  app.post(api.employees.create.path, async (req, res) => {
    try {
      const input = api.employees.create.input.parse(req.body);
      
      const existing = await storage.getEmployeeByEmail(input.email);
      if (existing) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const employee = await storage.createEmployee(input);
      res.status(201).json(employee);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.employees.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.employees.update.input.parse(req.body);
      
      const existing = await storage.getEmployee(id);
      if (!existing) {
        return res.status(404).json({ message: "Employee not found" });
      }

      if (input.email) {
        const emailCheck = await storage.getEmployeeByEmail(input.email);
        if (emailCheck && emailCheck.id !== id) {
          return res.status(409).json({ message: "Email already exists" });
        }
      }

      const updated = await storage.updateEmployee(id, input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.employees.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    const existing = await storage.getEmployee(id);
    if (!existing) {
      return res.status(404).json({ message: "Employee not found" });
    }
    
    await storage.deleteEmployee(id);
    res.status(204).send();
  });

  // === Attendance Routes ===

  app.post(api.attendance.mark.path, async (req, res) => {
    try {
      // Coerce employeeId to number if it comes as string
      const body = { ...req.body, employeeId: Number(req.body.employeeId) };
      const input = api.attendance.mark.input.parse(body);
      
      const employee = await storage.getEmployee(input.employeeId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      const record = await storage.markAttendance(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.attendance.getByEmployee.path, async (req, res) => {
    const employeeId = Number(req.params.id);
    const employee = await storage.getEmployee(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const records = await storage.getAttendanceByEmployee(employeeId);
    res.json(records);
  });

  // === Stats Route ===

  app.get(api.attendance.stats.path, async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingEmployees = await storage.getEmployees();
  if (existingEmployees.length === 0) {
    console.log("Seeding database...");
    
    // Create Employees
    const emp1 = await storage.createEmployee({
      name: "John Doe",
      email: "john.doe@example.com",
      department: "Engineering",
      role: "Software Engineer",
      joiningDate: "2023-01-15",
    });

    const emp2 = await storage.createEmployee({
      name: "Jane Smith",
      email: "jane.smith@example.com",
      department: "HR",
      role: "HR Manager",
      joiningDate: "2023-03-10",
    });

    const emp3 = await storage.createEmployee({
      name: "Alice Johnson",
      email: "alice.j@example.com",
      department: "Marketing",
      role: "Marketing Specialist",
      joiningDate: "2023-06-01",
    });

    // Create Attendance for today
    const today = new Date().toISOString().split('T')[0];
    await storage.markAttendance({
      employeeId: emp1.id,
      date: today,
      status: "Present"
    });

    await storage.markAttendance({
      employeeId: emp2.id,
      date: today,
      status: "Absent"
    });

    // Create past attendance
    await storage.markAttendance({
      employeeId: emp1.id,
      date: "2023-10-01",
      status: "Present"
    });
    
    console.log("Database seeded successfully!");
  }
}
