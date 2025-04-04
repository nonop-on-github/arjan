
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) throw error;
      
      // Redirect will be handled by the auth state change in AuthContext
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message === "Invalid login credentials"
          ? "Identifiants invalides. Veuillez vérifier votre email et mot de passe."
          : "Impossible de vous connecter. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Logo en haut à gauche */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2">
        <img src="/arjanLogo.png" alt="Arjan Logo" className="w-8 h-8 rounded-md" />
        <span className="text-2xl font-bold tracking-tight">arjan</span>
      </Link>
      
      {/* Section formulaire (gauche) */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@example.com"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-primary hover:underline">
                S'inscrire
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Section verte (droite) */}
      <div className="hidden md:flex flex-1 bg-green-500 items-center justify-center">
        <div className="text-white text-center p-8 max-w-lg">
          <h2 className="text-3xl font-bold mb-4">Gérez vos dépenses et revenus facilement. 💸</h2>
          <p className="text-white/80 text-lg">Suivez vos finances, créez un budget et atteignez vos objectifs financiers en toute simplicité.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
