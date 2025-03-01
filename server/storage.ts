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
    const [expense] = await db
      .insert(expenses)
      .values({
        amount: insertExpense.amount.toString(),
        category: insertExpense.category,
        date: new Date(insertExpense.date),
        description: insertExpense.description || null,
      })
      .returning();
    return expense;
  }

  async updateExpense(id: number, updateData: Partial<InsertExpense>): Promise<Expense | undefined> {
    const [updated] = await db
      .update(expenses)
      .set({
        amount: updateData.amount ? updateData.amount.toString() : undefined,
        category: updateData.category,
        date: updateData.date ? new Date(updateData.date) : undefined,
        description: updateData.description !== undefined ? updateData.description || null : undefined,
      })
      .where(eq(expenses.id, id))
      .returning();
    return updated;
  }

  async deleteExpense(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(expenses)
      .where(eq(expenses.id, id))
      .returning();
    return !!deleted;
  }
}

export const storage = new DatabaseStorage();