
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Wallet } from "lucide-react";
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  onNewTransaction?: () => void;
  onManageChannels?: () => void;
}

const Header = ({ onNewTransaction, onManageChannels }: HeaderProps) => {
  return (
    <header className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/arjanLogo.png"
          alt="Arjan Logo"
          className="w-8 h-8 rounded-md"
        />
        <h1 className="text-2xl font-bold">arjan</h1>
      </Link>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <Button
          onClick={onNewTransaction}
          className="flex items-center gap-1"
        >
          <PlusCircle size={18} />
          <span>Nouvelle transaction</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={onManageChannels}
          className="flex items-center gap-2"
          size="sm"
        >
          <Wallet className="h-4 w-4" />
          <span className="whitespace-nowrap">Gérer mes canaux</span>
        </Button>
        
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
