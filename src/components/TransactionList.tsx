
import { useState } from "react";
import { Transaction } from "@/types/finance";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarClock, Search, Pencil, Trash2, ArrowUpDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

type SortField = "date" | "amount" | "category";
type SortOrder = "asc" | "desc";

const TransactionList = ({ transactions, onEdit, onDelete }: TransactionListProps) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredTransactions = transactions
    .filter(
      (transaction) =>
        transaction.description.toLowerCase().includes(search.toLowerCase()) ||
        transaction.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === "date") {
        return sortOrder === "asc" 
          ? a.date.getTime() - b.date.getTime() 
          : b.date.getTime() - a.date.getTime();
      } else if (sortField === "amount") {
        return sortOrder === "asc" 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      } else if (sortField === "category") {
        return sortOrder === "asc" 
          ? a.category.localeCompare(b.category) 
          : b.category.localeCompare(a.category);
      }
      return 0;
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 -ml-4"
                  onClick={() => toggleSort("date")}
                >
                  Date
                  <ArrowUpDown className="h-4 w-4" />
                  {sortField === "date" && (
                    <span className="text-xs ml-1">
                      ({sortOrder === "asc" ? "↑" : "↓"})
                    </span>
                  )}
                </Button>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 -ml-4"
                  onClick={() => toggleSort("category")}
                >
                  Catégorie
                  <ArrowUpDown className="h-4 w-4" />
                  {sortField === "category" && (
                    <span className="text-xs ml-1">
                      ({sortOrder === "asc" ? "↑" : "↓"})
                    </span>
                  )}
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 justify-end ml-auto"
                  onClick={() => toggleSort("amount")}
                >
                  Montant
                  <ArrowUpDown className="h-4 w-4" />
                  {sortField === "amount" && (
                    <span className="text-xs ml-1">
                      ({sortOrder === "asc" ? "↑" : "↓"})
                    </span>
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{new Date(transaction.date).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell className="flex items-center gap-2">
                  {transaction.isRecurring && (
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  )}
                  {transaction.description}
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  {transaction.type === "income" ? "Revenu" : "Dépense"}
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    transaction.type === "income" ? "text-income" : "text-expense"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {transaction.amount.toLocaleString("fr-FR")}€
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionList;
