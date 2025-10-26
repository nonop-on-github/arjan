import { z } from 'zod';

// Category validation schema
export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  emoji: z.string().trim().min(1, "L'emoji est requis").max(4, "L'emoji ne peut pas dépasser 4 caractères"),
});

// Channel validation schema
export const channelSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  icon: z.string().trim().min(1, "L'icône est requis").max(4, "L'icône ne peut pas dépasser 4 caractères"),
  color: z.string().optional(),
});

// Transaction validation schema
export const transactionSchema = z.object({
  id: z.string().optional(),
  amount: z.number().positive("Le montant doit être positif").max(999999999, "Le montant est trop élevé"),
  type: z.enum(["income", "expense"], { errorMap: () => ({ message: "Type invalide" }) }),
  date: z.date(),
  description: z.string().trim().max(500, "La description ne peut pas dépasser 500 caractères").optional(),
  category: z.string().trim().max(100, "La catégorie ne peut pas dépasser 100 caractères"),
  channelId: z.string().trim().max(100, "Le canal ne peut pas dépasser 100 caractères"),
  isRecurring: z.boolean(),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  nextDate: z.date().optional(),
  endDate: z.date().optional(),
});

// Password validation schema
export const passwordSchema = z.object({
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
});

// Profile validation schema
export const profileSchema = z.object({
  first_name: z.string().trim().min(1, "Le prénom est requis").max(100, "Le prénom ne peut pas dépasser 100 caractères"),
  last_name: z.string().trim().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
});
