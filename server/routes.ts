import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExpenseSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/expenses", async (_req, res) => {
    const expenses = await storage.getExpenses();
    res.json(expenses);
  });

  app.post("/api/expenses", async (req, res) => {
    const result = insertExpenseSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const expense = await storage.createExpense(result.data);
    res.status(201).json(expense);
  });

  app.patch("/api/expenses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const result = insertExpenseSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const updated = await storage.updateExpense(id, result.data);
    if (!updated) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(updated);
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const success = await storage.deleteExpense(id);
    if (!success) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(204).end();
  });

  return createServer(app);
}
