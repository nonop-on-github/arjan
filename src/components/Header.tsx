
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { 
  Sun, 
  Moon, 
  PlusCircle
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import UserMenu from "./UserMenu";

interface HeaderProps {
  onNewTransaction: () => void;
}

const Header = ({ onNewTransaction }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthContext();

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-4xl font-bold tracking-tight">arjan</h1>
      <div className="flex items-center gap-4">
        <Button
          onClick={onNewTransaction}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Nouvelle transaction
        </Button>
        {user && (
          <UserMenu />
        )}
      </div>
    </header>
  );
};

export default Header;
