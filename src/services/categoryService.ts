
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/finance";
import { categorySchema } from "@/lib/validationSchemas";

// Type pour les catégories dans la base de données
interface DbCategory {
  id: string;
  user_id: string;
  emoji: string;
  name: string;
}

// Formatter une catégorie depuis la base de données vers le modèle de l'application
export const formatDbCategory = (c: DbCategory): Category => ({
  id: c.id,
  emoji: c.emoji,
  name: c.name,
});

// Récupérer toutes les catégories d'un utilisateur
export const fetchUserCategories = async (userId: string): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('name');
    
  if (error) throw error;
  return (data as DbCategory[]).map(formatDbCategory);
};

// Ajouter une nouvelle catégorie
export const addUserCategory = async (category: Category, userId: string): Promise<Category> => {
  // Validate input
  const validated = categorySchema.parse(category);
  
  const { data, error } = await supabase
    .from('categories')
    .insert({
      user_id: userId,
      emoji: validated.emoji,
      name: validated.name
    })
    .select()
    .single();
    
  if (error) throw error;
  return formatDbCategory(data as DbCategory);
};

// Mettre à jour une catégorie existante
export const updateUserCategory = async (category: Category, userId: string): Promise<boolean> => {
  // Validate input
  const validated = categorySchema.parse(category);
  
  const { error } = await supabase
    .from('categories')
    .update({
      emoji: validated.emoji,
      name: validated.name
    })
    .eq('id', category.id)
    .eq('user_id', userId);
    
  if (error) throw error;
  return true;
};

// Supprimer une catégorie
export const deleteUserCategory = async (categoryId: string, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)
    .eq('user_id', userId);
    
  if (error) throw error;
  return true;
};

// Catégories par défaut à initialiser pour un nouvel utilisateur
const DEFAULT_CATEGORIES: Array<Omit<Category, 'id'>> = [
  { emoji: "🥦", name: "Alimentation" },
  { emoji: "🚌", name: "Transport" },
  { emoji: "🏠", name: "Logement" },
  { emoji: "🎢", name: "Loisirs" },
  { emoji: "🩺", name: "Santé" },
  { emoji: "🛒", name: "Shopping" },
  { emoji: "📱", name: "Abonnements" },
];

// Insère les catégories par défaut si l'utilisateur n'en a aucune
export const seedDefaultCategories = async (userId: string): Promise<Category[]> => {
  const insertPayload = DEFAULT_CATEGORIES.map((c) => ({
    user_id: userId,
    emoji: c.emoji,
    name: c.name,
  }));

  const { data, error } = await supabase
    .from('categories')
    .insert(insertPayload)
    .select('*');

  if (error) throw error;
  return (data as DbCategory[]).map(formatDbCategory);
};

// Récupère les catégories de l'utilisateur et initialise avec des valeurs par défaut si nécessaire
export const fetchOrInitUserCategories = async (userId: string): Promise<Category[]> => {
  const existing = await fetchUserCategories(userId);
  if (existing.length > 0) return existing;
  // Aucune catégorie: initialiser avec les catégories par défaut
  return await seedDefaultCategories(userId);
};
