
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Transaction, TransactionType, TransactionFrequency, Channel } from "@/types/finance";
import { CategorySelect } from "./forms/CategorySelect";
import { ChannelSelect } from "./forms/ChannelSelect";
import { RecurringTransactionFields } from "./forms/RecurringTransactionFields";
import { TransactionTypeSelect } from "./forms/TransactionTypeSelect";
import { useToast } from "@/hooks/use-toast";

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSubmit: (transaction: Transaction) => Promise<boolean>;
  onClose: () => void;
  channels: Channel[];
}

const TransactionForm = ({ transaction, onSubmit, onClose, channels }: TransactionFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense" as TransactionType,
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "",
    channelId: channels.length > 0 ? channels[0].id : "",
    isRecurring: false,
    frequency: "monthly" as TransactionFrequency,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        type: transaction.type,
        date: new Date(transaction.date).toISOString().split("T")[0],
        description: transaction.description,
        category: transaction.category,
        channelId: transaction.channelId,
        isRecurring: transaction.isRecurring,
        frequency: transaction.frequency || "monthly",
      });
    } else if (channels.length > 0) {
      // Si pas de transaction mais des canaux disponibles, sélectionner le premier
      setFormData(prev => ({ ...prev, channelId: channels[0].id }));
    }
  }, [transaction, channels]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Conversion du montant avec prise en charge de la virgule
    const normalizedAmount = formData.amount.replace(',', '.');
    const amount = parseFloat(normalizedAmount);
    
    // Validation: vérifie si le montant est valide
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez entrer un montant valide.",
        variant: "destructive",
      });
      return;
    }
    
    // Validation: vérifie si la description est remplie
    if (!formData.description.trim()) {
      toast({
        title: "Description manquante",
        description: "Veuillez ajouter une description.",
        variant: "destructive",
      });
      return;
    }
    
    // Validation: vérifie si un canal est sélectionné
    if (!formData.channelId) {
      toast({
        title: "Canal manquant",
        description: "Veuillez sélectionner un canal.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedDate = new Date(formData.date);
    selectedDate.setHours(23, 59, 59, 999);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    // Vérifie si la date n'est pas dans le futur
    if (selectedDate > today) {
      toast({
        title: "Date invalide",
        description: "La date ne peut pas être dans le futur.",
        variant: "destructive",
      });
      return;
    }
    
    const newTransaction: Transaction = {
      id: transaction?.id || Date.now().toString(),
      amount: amount,
      type: formData.type,
      date: new Date(formData.date),
      description: formData.description,
      category: formData.category,
      channelId: formData.channelId,
      isRecurring: formData.isRecurring,
      frequency: formData.isRecurring ? formData.frequency : undefined,
    };

    try {
      setIsSubmitting(true);
      const success = await onSubmit(newTransaction);
      if (!success) {
        toast({
          title: "Échec",
          description: "Impossible d'ajouter la transaction.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Modifier la transaction" : "Nouvelle transaction"}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations de la transaction
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (€)</Label>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                value={formData.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  // Ne permet que les chiffres et une seule virgule
                  if (value === '' || /^[0-9]*,?[0-9]*$/.test(value)) {
                    updateFormData("amount", value);
                  }
                }}
                placeholder="0,00"
              />
            </div>
            <TransactionTypeSelect 
              transactionType={formData.type} 
              onTypeChange={(type) => updateFormData("type", type)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={formData.date}
              onChange={(e) => updateFormData("date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              placeholder="Ex: Courses chez Carrefour"
            />
          </div>

          <ChannelSelect 
            channelId={formData.channelId}
            channels={channels}
            onChannelChange={(channelId) => updateFormData("channelId", channelId)}
          />

          <CategorySelect 
            category={formData.category}
            onCategoryChange={(category) => updateFormData("category", category)}
          />

          <RecurringTransactionFields 
            isRecurring={formData.isRecurring}
            frequency={formData.frequency}
            onRecurringChange={(checked) => updateFormData("isRecurring", checked)}
            onFrequencyChange={(frequency) => updateFormData("frequency", frequency)}
          />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "En cours..." : (transaction ? "Modifier" : "Ajouter")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
