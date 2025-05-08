
import { useState } from "react";
import { Budget, BudgetProgress } from "@/types/budget";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import BudgetForm from "./BudgetForm";

interface BudgetOverviewProps {
  budgets: Budget[];
  budgetProgress: BudgetProgress[];
  isLoading: boolean;
  onAdd: (budget: Omit<Budget, 'id'>) => Promise<boolean>;
  onUpdate: (budget: Budget) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export const BudgetOverview = ({
  budgets,
  budgetProgress,
  isLoading,
  onAdd,
  onUpdate,
  onDelete,
}: BudgetOverviewProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingBudget, setDeletingBudget] = useState<string | null>(null);

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  const handleDelete = async () => {
    if (deletingBudget) {
      await onDelete(deletingBudget);
      setDeletingBudget(null);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <>
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Budgets</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter un budget</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6">Chargement des budgets...</div>
          ) : budgetProgress.length > 0 ? (
            <div className="space-y-4">
              {budgetProgress.map((progress) => (
                <div key={progress.category} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{progress.category}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {progress.spentAmount.toLocaleString("fr-FR")}€ / {progress.budgetAmount.toLocaleString("fr-FR")}€
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {budgets
                        .filter((b) => b.category === progress.category)
                        .map((budget) => (
                          <div key={budget.id} className="flex">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(budget)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingBudget(budget.id)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress
                      value={progress.percentageUsed}
                      className="h-2"
                      indicatorClassName={getProgressColor(progress.percentageUsed)}
                    />
                    <span className="text-sm font-medium w-10">
                      {Math.round(progress.percentageUsed)}%
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {progress.remainingAmount > 0
                      ? `Reste ${progress.remainingAmount.toLocaleString("fr-FR")}€`
                      : `Dépassé de ${Math.abs(progress.remainingAmount).toLocaleString("fr-FR")}€`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Aucun budget configuré. Cliquez sur "Ajouter un budget" pour commencer.
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <BudgetForm
          budget={editingBudget || undefined}
          onSubmit={editingBudget ? onUpdate : onAdd}
          onClose={handleCloseForm}
        />
      )}

      <AlertDialog open={!!deletingBudget} onOpenChange={() => setDeletingBudget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement ce budget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BudgetOverview;
