import { pgTable, text, serial, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  amount: numeric("amount").notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  description: text("description"),
});

export const insertExpenseSchema = createInsertSchema(expenses)
  .omit({ id: true })
  .extend({
    amount: z.number().positive(),
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
    date: z.date(),
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