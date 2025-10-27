
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Transaction, TransactionType, TransactionFrequency, Channel } from "@/types/finance";
import { CategorySelect } from "./forms/CategorySelect";
import { ChannelSelect } from "./forms/ChannelSelect";
import { RecurringTransactionFields } from "./forms/RecurringTransactionFields";
import { TransactionTypeSelect } from "./forms/TransactionTypeSelect";

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSubmit: (transaction: Transaction) => void;
  onClose: () => void;
  channels: Channel[];
}

const TransactionForm = ({ transaction, onSubmit, onClose, channels }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense" as TransactionType,
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "🥦 Alimentation",
    channelId: channels.length > 0 ? channels[0].id : "",
    isRecurring: false,
    frequency: "monthly" as TransactionFrequency,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Conversion du montant avec prise en charge de la virgule
    const normalizedAmount = formData.amount.replace(',', '.');
    const amount = parseFloat(normalizedAmount);
    
    // Validation: vérifie si le montant est valide
    if (isNaN(amount) || amount <= 0) {
      alert("Veuillez entrer un montant valide.");
      return;
    }
    
    // Validation: vérifie si la description est remplie
    if (!formData.description.trim()) {
      alert("Veuillez ajouter une description.");
      return;
    }
    
    // Validation: vérifie si un canal est sélectionné
    if (!formData.channelId) {
      alert("Veuillez sélectionner un canal.");
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

    // Vérifie si la date n'est pas dans le futur
    if (newTransaction.date > new Date()) {
      alert("La date ne peut pas être dans le futur. Ok vous êtes peut-être visionnaire mais n'abusez pas svp.");
      return;
    }

    onSubmit(newTransaction);
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
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (€)</Label>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                required
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
              required
              max={new Date().toISOString().split("T")[0]}
              value={formData.date}
              onChange={(e) => updateFormData("date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              required
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
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
            <Button type="submit">
              {transaction ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
