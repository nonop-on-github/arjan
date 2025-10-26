import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    signIn,
    signInWithGoogle
  } = useAuthContext();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const {
        error
      } = await signIn(email, password);
      if (error) throw error;

      // Redirect will be handled by the auth state change in AuthContext
      navigate('/', {
        replace: true
      });
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message === "Invalid login credentials" ? "Identifiants invalides. Veuillez vérifier votre email et mot de passe." : "Impossible de vous connecter. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const {
        error
      } = await signInWithGoogle();
      if (error) throw error;

      // Redirect will be handled by Google OAuth flow
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Erreur de connexion Google",
        description: "Impossible de vous connecter avec Google. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header avec logo et toggle de thème */}
      <div className="w-full p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/arjanLogo.png" alt="Arjan Logo" className="w-8 h-8 rounded-md" />
          <span className="text-2xl font-bold tracking-tight">arjan</span>
        </Link>
        <ThemeToggle />
      </div>
      
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Section formulaire (gauche) */}
        <div className="flex-1 flex items-center justify-center p-4 order-2 md:order-1 overflow-y-auto">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Bouton Google */}
              <Button onClick={handleGoogleSignIn} disabled={isGoogleLoading} variant="outline" className="w-full">
                {isGoogleLoading ? "Connexion avec Google..." : <>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continuer avec Google
                  </>}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continuer avec
                  </span>
                </div>
              </div>

              {/* Formulaire email/password */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jaime.l@arjan.com" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
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
        <div className="md:flex-1 bg-green-500 dark:bg-green-700 flex items-center justify-center p-6 md:p-0 order-1 md:order-2 min-h-[30vh] md:min-h-0">
          <div className="text-white text-center p-4 md:p-8 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Reprenez le contrôle de vos finances ! 💰</h2>
            <p className="text-white/80 text-md md:text-lg">Connectez-vous pour accéder à votre tableau de bord et suivre vos dépenses en temps réel.</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
