
import React, { useState } from "react";
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

const COMMON_EMOJIS = ["🥦", "🚌", "🏠", "🎢", "🩺", "🛒", "📱", "💰", "🍴", "🚗", "💼", "📚", "🏥", "👕", "💳"];

interface CategoryCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateCategory: (emoji: string, name: string) => void;
}

export const CategoryCreateDialog = ({ open, onClose, onCreateCategory }: CategoryCreateDialogProps) => {
  const [emoji, setEmoji] = useState("🥦");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emoji && name.trim()) {
      onCreateCategory(emoji, name.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
        </DialogHeader>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={!emoji || !name.trim()}>
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryCreateDialog;
