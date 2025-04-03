
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { 
  Sun, 
  Moon, 
  PlusCircle, 
  LogOut 
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onNewTransaction: () => void;
}

const Header = ({ onNewTransaction }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-4xl font-bold tracking-tight">Finance Personnel</h1>
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm">
            {user.email}
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <Button
          onClick={onNewTransaction}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Nouvelle Transaction
        </Button>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </Button>
      </div>
    </header>
  );
};

export default Header;
