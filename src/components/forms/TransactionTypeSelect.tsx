
import { Label } from "@/components/ui/label";
import { TransactionType } from "@/types/finance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionTypeSelectProps {
  transactionType: TransactionType;
  onTypeChange: (type: TransactionType) => void;
}

export function TransactionTypeSelect({ 
  transactionType, 
  onTypeChange 
}: TransactionTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Type</Label>
      <Select
        value={transactionType}
        onValueChange={(value: TransactionType) => onTypeChange(value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="expense">Dépense</SelectItem>
          <SelectItem value="income">Revenu</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
