import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Expense, categoryColors } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExpenseListProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onEdit: (expense: Expense) => void;
}

export function ExpenseList({
  selectedCategory,
  onCategoryChange,
  onEdit,
}: ExpenseListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: expenses, isLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/expenses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      toast({
        title: "Expense deleted",
        description: "The expense has been removed successfully.",
      });
    },
  });

  const filteredExpenses = expenses?.filter(
    (expense) => !selectedCategory || expense.category === selectedCategory
  );

  const categories = [
    "Food",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Education",
    "Health",
    "Shopping",
    "Saving & Investments",
    "Other"
  ] as const;

  if (isLoading) {
    return <div>Loading expenses...</div>;
  }

  const formatDate = (dateStr: string | Date) => {
    try {
      const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onCategoryChange(null)}
          className="bg-[#4CAF50] text-white"
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            style={{
              backgroundColor: selectedCategory === category ? categoryColors[category] : "transparent",
              color: selectedCategory === category ? "white" : categoryColors[category],
              borderColor: categoryColors[category],
            }}
          >
            {category}
          </Button>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredExpenses?.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{formatDate(expense.date)}</TableCell>
              <TableCell>
                <Badge
                  style={{
                    backgroundColor: categoryColors[expense.category as keyof typeof categoryColors],
                  }}
                >
                  {expense.category}
                </Badge>
              </TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell className="text-right">
                ${Number(expense.amount).toFixed(2)}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onEdit(expense)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteMutation.mutate(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}