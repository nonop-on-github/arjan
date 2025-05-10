
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/finance";
import CategoryCreateDialog from "./CategoryCreateDialog";
import { useAuthContext } from "@/contexts/AuthContext";
import { fetchUserCategories, addUserCategory } from "@/services/categoryService";
import { useToast } from "@/hooks/use-toast";

// Catégories par défaut pour les nouveaux utilisateurs
const defaultCategories: Category[] = [
  { id: "default-1", emoji: "🥦", name: "Alimentation" },
  { id: "default-2", emoji: "🚌", name: "Transport" },
  { id: "default-3", emoji: "🏠", name: "Logement" },
  { id: "default-4", emoji: "🎢", name: "Loisirs" },
  { id: "default-5", emoji: "🩺", name: "Santé" },
  { id: "default-6", emoji: "🛒", name: "Shopping" },
  { id: "default-7", emoji: "📱", name: "Abonnements" }
];

interface CategorySelectProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

export function CategorySelect({ category, onCategoryChange }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { user } = useAuthContext();
  const { toast } = useToast();
  
  useEffect(() => {
    // Charger les catégories de l'utilisateur depuis la base de données
    const loadCategories = async () => {
      if (!user) return;
      
      try {
        const userCategories = await fetchUserCategories(user.id);
        if (userCategories.length > 0) {
          setCategories(userCategories);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };
    
    loadCategories();
  }, [user]);

  const handleCreateCategory = async (emoji: string, name: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une catégorie",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newCategory = await addUserCategory({
        id: "", // ID sera généré par Supabase
        emoji,
        name
      }, user.id);
      
      setCategories(prev => [...prev, newCategory]);
      onCategoryChange(`${newCategory.emoji} ${newCategory.name}`);
      
      toast({
        title: "Succès",
        description: "Catégorie créée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la création de la catégorie:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la catégorie",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label>Catégorie</Label>
      <div className="flex gap-2">
        <Select
          value={category}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={`${cat.emoji} ${cat.name}`}>
                {cat.emoji} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setShowCreateDialog(true)}
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {showCreateDialog && (
        <CategoryCreateDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onCreateCategory={handleCreateCategory}
        />
      )}
    </div>
  );
}
