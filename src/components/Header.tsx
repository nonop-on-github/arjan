
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon, PlusCircle, LogOut, User } from "lucide-react";
import { useAuthContext } from "@/components/providers/AuthProvider";

interface HeaderProps {
  onNewTransaction: () => void;
}

const Header = ({ onNewTransaction }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const { profile, signOut } = useAuthContext();

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-4xl font-bold tracking-tight">Finance Personnel</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {profile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>
                {profile.first_name} {profile.last_name}
              </span>
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
          <Button variant="outline" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        <Button onClick={onNewTransaction} className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Nouvelle Transaction
        </Button>
      </div>
    </header>
  );
};

export default Header;
