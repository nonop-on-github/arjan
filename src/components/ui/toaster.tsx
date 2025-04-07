
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

// Fonction pour ajouter des émojis selon le type de toast
const getToastEmoji = (variant?: "default" | "destructive") => {
  if (variant === "destructive") {
    return "❌ ";
  } else {
    return "✅ ";
  }
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // Ajouter un émoji selon le type du toast
        const emoji = getToastEmoji(variant);
        const titleWithEmoji = title ? `${emoji}${title}` : title;
        
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{titleWithEmoji}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
