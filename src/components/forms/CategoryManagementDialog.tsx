
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Trash2, Edit2, Plus } from "lucide-react";
import { Category } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";

const COMMON_EMOJIS = ["🥦", "🚌", "🏠", "🎢", "🩺", "🛒", "📱", "💰", "🍴", "🚗", "💼", "📚", "🏥", "👕", "💳"];

interface CategoryManagementDialogProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onCreateCategory: (emoji: string, name: string) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const CategoryManagementDialog = ({ 
  open, 
  onClose, 
  categories, 
  onCreateCategory, 
  onUpdateCategory, 
  onDeleteCategory 
}: CategoryManagementDialogProps) => {
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [emoji, setEmoji] = useState("🥦");
  const [name, setName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (editingCategory) {
      setEmoji(editingCategory.emoji);
      setName(editingCategory.name);
      setMode('edit');
    }
  }, [editingCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emoji && name.trim()) {
      if (mode === 'create') {
        onCreateCategory(emoji, name.trim());
      } else if (mode === 'edit' && editingCategory) {
        onUpdateCategory({
          ...editingCategory,
          emoji,
          name: name.trim()
        });
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setEmoji("🥦");
    setName("");
    setEditingCategory(null);
    setMode('list');
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        await onDeleteCategory(categoryToDelete.id);
        setCategoryToDelete(null);
        toast({
          title: "Succès",
          description: "Catégorie supprimée avec succès",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la catégorie",
          variant: "destructive",
        });
      }
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {mode === 'list' && "Gérer les catégories"}
              {mode === 'create' && "Créer une nouvelle catégorie"}
              {mode === 'edit' && "Modifier la catégorie"}
            </DialogTitle>
          </DialogHeader>

          {mode === 'list' && (
            <div className="space-y-4">
              <div className="max-h-60 overflow-y-auto space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.emoji}</span>
                      <span>{category.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCategory(category)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCategoryToDelete(category)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>
                  Fermer
                </Button>
                <Button onClick={() => setMode('create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle catégorie
                </Button>
              </DialogFooter>
            </div>
          )}

          {(mode === 'create' || mode === 'edit') && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Emoji</Label>
                <div className="grid grid-cols-5 gap-2">
                  {COMMON_EMOJIS.map((e) => (
                    <Button
                      key={e}
                      type="button"
                      variant={emoji === e ? "default" : "outline"}
                      onClick={() => setEmoji(e)}
                      className="text-xl h-10 w-10 p-0"
                    >
                      {e}
                    </Button>
                  ))}
                </div>
                <Input 
                  placeholder="Ou entrez un emoji personnalisé" 
                  value={emoji} 
                  onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryName">Nom de la catégorie</Label>
                <Input
                  id="categoryName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Alimentation, Transport..."
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Retour
                </Button>
                <Button type="submit" disabled={!emoji || !name.trim()}>
                  {mode === 'create' ? 'Créer' : 'Modifier'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la catégorie</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la catégorie "{categoryToDelete?.emoji} {categoryToDelete?.name}" ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CategoryManagementDialog;
