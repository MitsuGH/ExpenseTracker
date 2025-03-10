import { mysqlTable, varchar, decimal, date, bigint, timestamp } from 'drizzle-orm/mysql-core';
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = mysqlTable('categories', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(), // ✅ Changed to BIGINT
  name: varchar('name', { length: 50 }).notNull(),
  userId: bigint('user_id', { mode: 'number' }).references(() => users.id),
});

export const expenses = mysqlTable('expenses', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: varchar('description', { length: 255 }),
  categoryId: bigint('category_id', { mode: 'number' }).references(() => categories.id, {
    onDelete: "no action",
    onUpdate: "no action",
  }), // ✅ Ensured it's BIGINT
  userId: bigint('user_id', { mode: 'number' }).references(() => users.id),
  date: date('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const insertExpenseSchema = createInsertSchema(expenses)
  .omit({ id: true })
  .extend({
    amount: z.number().positive("Amount must be greater than 0"),
    category: z.enum([
      "Food",
      "Transportation",
      "Entertainment",
      "Utilities",
      "Education",
      "Health",
      "Shopping",
      "Saving & Investments",
      "Other"
    ]),
    description: z.string().optional(),
    date: z.string(),  // Changed to string since we'll send ISO string
  });

export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;

export const categoryColors = {
  Food: "#FF5722",
  Transportation: "#3F51B5",
  Entertainment: "#E91E63",
  Utilities: "#9C27B0",
  Education: "#2196F3",
  Health: "#4CAF50",
  Shopping: "#FF9800",
  "Saving & Investments": "#009688",
  Other: "#607D8B",
};
