import { ExpenseForm } from "@/components/expense-form";
import { ExpenseList } from "@/components/expense-list";
import { ExpenseSummary } from "@/components/expense-summary";
import { useState } from "react";
import { type Expense } from "@shared/schema";

export default function Home() {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#333333]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-[#4CAF50]">Expense Tracker</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ExpenseForm 
                expense={selectedExpense}
                onSuccess={() => setSelectedExpense(null)}
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ExpenseList
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onEdit={setSelectedExpense}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <ExpenseSummary selectedCategory={selectedCategory} />
          </div>
        </div>
      </div>
    </div>
  );
}
