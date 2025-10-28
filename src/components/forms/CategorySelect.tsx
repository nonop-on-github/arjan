
import { useState, useEffect } from "react";
import { Plus, Settings } from "lucide-react";
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
import CategoryManagementDialog from "./CategoryManagementDialog";
import { useAuthContext } from "@/contexts/AuthContext";
import { fetchUserCategories, fetchOrInitUserCategories, addUserCategory, updateUserCategory, deleteUserCategory } from "@/services/categoryService";
import { useToast } from "@/hooks/use-toast";


interface CategorySelectProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

export function CategorySelect({ category, onCategoryChange }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const { user } = useAuthContext();
  const { toast } = useToast();
  
  useEffect(() => {
    // Charger les catégories de l'utilisateur depuis la base de données
    const loadCategories = async () => {
      if (!user) return;
      try {
        const userCategories = await fetchOrInitUserCategories(user.id);
        setCategories(userCategories);
        // Auto-sélectionner la première si aucune sélection actuelle
        if (!category && userCategories.length > 0) {
          onCategoryChange(userCategories[0].id);
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
        id: "", // ID sera généré par le backend
        emoji,
        name
      }, user.id);

      // Recharger depuis la base pour éviter les doublons et garder l'ordre
      const refreshed = await fetchUserCategories(user.id);
      setCategories(refreshed);
      onCategoryChange(newCategory.id);

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

  const handleUpdateCategory = async (updatedCategory: Category) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour modifier une catégorie",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await updateUserCategory(updatedCategory, user.id);

      const refreshed = await fetchUserCategories(user.id);
      setCategories(refreshed);

      // Mettre à jour la catégorie sélectionnée si c'est celle qui a été modifiée
      const currentCategoryId = category;
      if (currentCategoryId === updatedCategory.id) {
        onCategoryChange(updatedCategory.id);
      }

      toast({
        title: "Succès",
        description: "Catégorie modifiée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la modification de la catégorie:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la catégorie",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour supprimer une catégorie",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await deleteUserCategory(categoryId, user.id);

      // Recharger depuis la base pour éviter les incohérences
      const refreshed = await fetchUserCategories(user.id);
      setCategories(refreshed);

      // Si la catégorie supprimée était sélectionnée, sélectionner la première catégorie disponible
      if (categoryId === category) {
        if (refreshed.length > 0) {
          const valid = refreshed.filter(cat => /^[0-9a-fA-F-]{36}$/.test(cat.id));
          onCategoryChange(valid.length > 0 ? valid[0].id : "");
        } else {
          onCategoryChange("");
        }
      }

      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
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
            {categories
              .filter((cat) => /^[0-9a-fA-F-]{36}$/.test(cat.id))
              .map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
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
          title="Ajouter une catégorie"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setShowManageDialog(true)}
          size="icon"
          title="Gérer les catégories"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {showCreateDialog && (
        <CategoryCreateDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onCreateCategory={handleCreateCategory}
        />
      )}

      {showManageDialog && (
        <CategoryManagementDialog
          open={showManageDialog}
          onClose={() => setShowManageDialog(false)}
          categories={categories}
          onCreateCategory={handleCreateCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
    </div>
  );
}
