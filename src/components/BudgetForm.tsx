
import { useState } from "react";
import { Budget } from "@/types/budget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CategorySelect } from "@/components/forms/CategorySelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BudgetFormProps {
  budget?: Budget;
  onSubmit: (budget: Omit<Budget, 'id'> | Budget) => Promise<boolean>;
  onClose: () => void;
}

export const BudgetForm = ({ budget, onSubmit, onClose }: BudgetFormProps) => {
  const [formData, setFormData] = useState<Omit<Budget, 'id'> | Budget>(
    budget || {
      category: "",
      amount: 0,
      period: "monthly",
      startDate: new Date(),
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!formData.category || formData.amount <= 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(formData);
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {budget ? "Modifier le budget" : "Ajouter un budget"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <CategorySelect 
            category={formData.category} 
            onCategoryChange={(value) => updateFormData("category", value)} 
          />
          
          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => updateFormData("amount", parseFloat(e.target.value) || 0)}
              placeholder="0,00"
              inputMode="decimal"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Période</Label>
            <Select
              value={formData.period}
              onValueChange={(value: 'monthly' | 'yearly') => updateFormData("period", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mensuel</SelectItem>
                <SelectItem value="yearly">Annuel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">Date de début</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate.toISOString().split('T')[0]}
              onChange={(e) => updateFormData("startDate", new Date(e.target.value))}
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.category || formData.amount <= 0}
            >
              {isSubmitting ? "En cours..." : budget ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetForm;
