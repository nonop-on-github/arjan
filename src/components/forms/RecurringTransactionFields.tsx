
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TransactionFrequency } from "@/types/finance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecurringTransactionFieldsProps {
  isRecurring: boolean;
  frequency: TransactionFrequency;
  onRecurringChange: (checked: boolean) => void;
  onFrequencyChange: (frequency: TransactionFrequency) => void;
}

export function RecurringTransactionFields({
  isRecurring,
  frequency,
  onRecurringChange,
  onFrequencyChange
}: RecurringTransactionFieldsProps) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id="recurring"
          checked={isRecurring}
          onCheckedChange={onRecurringChange}
        />
        <Label htmlFor="recurring">Transaction récurrente</Label>
      </div>

      {isRecurring && (
        <div className="space-y-2">
          <Label>Fréquence</Label>
          <Select
            value={frequency}
            onValueChange={(value: TransactionFrequency) => onFrequencyChange(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensuelle</SelectItem>
              <SelectItem value="yearly">Annuelle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}
