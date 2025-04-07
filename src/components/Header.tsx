
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle,
  User
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import UserMenu from "./UserMenu";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onNewTransaction: () => void;
}

const Header = ({ onNewTransaction }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthContext();
  const isMobile = useIsMobile();

  return (
    <header className="pb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img src="/arjanLogo.png" alt="Arjan Logo" className="w-8 h-8 rounded-md" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">arjan</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {!isMobile && (
            <Button
              onClick={onNewTransaction}
              className="flex items-center gap-2"
              size={isMobile ? "sm" : "default"}
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Nouvelle transaction</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>
          )}
          {user && (
            <UserMenu />
          )}
        </div>
      </div>
      <Separator className="my-2" />
    </header>
  );
};

export default Header;
