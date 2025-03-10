import { expenses, type Expense, type InsertExpense } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getExpenses(): Promise<Expense[]>;
  getExpenseById(id: number): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getExpenses(): Promise<Expense[]> {
    return await db.select().from(expenses);
  }

  async getExpenseById(id: number): Promise<Expense | undefined> {
    const [expense] = await db.select().from(expenses).where(eq(expenses.id, id));
    return expense;
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const result = await db
      .insert(expenses)
      .values({
        amount: insertExpense.amount.toString(),
        categoryId: insertExpense.categoryId,
        date: new Date(insertExpense.date),
        description: insertExpense.description || null,
      });

    // Fetch the inserted row
    const [expense] = await db.select().from(expenses).where(eq(expenses.id, result[0].insertId));
    return expense;
  }

  async updateExpense(id: number, updateData: Partial<InsertExpense>): Promise<Expense | undefined> {
    const result = await db
      .update(expenses)
      .set({
        amount: updateData.amount ? updateData.amount.toString() : undefined,
        categoryId: updateData.categoryId,
        date: updateData.date ? new Date(updateData.date) : undefined,
        description: updateData.description !== undefined ? updateData.description || null : undefined,
      })
      .where(eq(expenses.id, id));

    // Fetch the updated row
    const [updated] = await db.select().from(expenses).where(eq(expenses.id, id));
    return updated;
  }

  async deleteExpense(id: number): Promise<boolean> {
    const result = await db.delete(expenses).where(eq(expenses.id, id));
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();