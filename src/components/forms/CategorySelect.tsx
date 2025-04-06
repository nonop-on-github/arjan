
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const categories = [
  "🥦 Alimentation",
  "🚌 Transport",
  "🏠 Logement",
  "🎢 Loisirs",
  "🩺 Santé",
  "🛒 Shopping",
  "📱 Abonnements",
  "Autres",
];

interface CategorySelectProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

export function CategorySelect({ category, onCategoryChange }: CategorySelectProps) {
  return (
    <div className="space-y-2">
      <Label>Catégorie</Label>
      <Select
        value={category}
        onValueChange={onCategoryChange}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
