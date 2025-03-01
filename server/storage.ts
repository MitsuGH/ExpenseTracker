import { expenses, type Expense, type InsertExpense } from "@shared/schema";

export interface IStorage {
  getExpenses(): Promise<Expense[]>;
  getExpenseById(id: number): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private expenses: Map<number, Expense>;
  private currentId: number;

  constructor() {
    this.expenses = new Map();
    this.currentId = 1;
  }

  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async getExpenseById(id: number): Promise<Expense | undefined> {
    return this.expenses.get(id);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.currentId++;
    const expense: Expense = {
      id,
      amount: insertExpense.amount.toString(), // Convert number to string for storage
      category: insertExpense.category,
      date: insertExpense.date || new Date(),
      description: insertExpense.description || null,
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async updateExpense(id: number, updateData: Partial<InsertExpense>): Promise<Expense | undefined> {
    const existing = this.expenses.get(id);
    if (!existing) return undefined;

    const updated: Expense = {
      ...existing,
      amount: updateData.amount ? updateData.amount.toString() : existing.amount,
      category: updateData.category || existing.category,
      date: updateData.date || existing.date,
      description: updateData.description !== undefined ? updateData.description || null : existing.description,
    };

    this.expenses.set(id, updated);
    return updated;
  }

  async deleteExpense(id: number): Promise<boolean> {
    return this.expenses.delete(id);
  }
}

export const storage = new MemStorage();