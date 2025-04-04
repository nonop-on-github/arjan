
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Calcul de la force du mot de passe
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    // Critères simples pour évaluer la force du mot de passe
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.match(/[A-Z]/)) strength += 20;
    if (password.match(/[a-z]/)) strength += 20;
    if (password.match(/[0-9]/)) strength += 20;
    if (password.match(/[^A-Za-z0-9]/)) strength += 20;

    setPasswordStrength(strength);
  }, [password]);

  // Fonction pour obtenir la couleur de la barre de progression
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 20) return 'bg-red-500';
    if (passwordStrength <= 40) return 'bg-orange-500';
    if (passwordStrength <= 60) return 'bg-yellow-500';
    if (passwordStrength <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordStrength < 40) {
      toast({
        title: "Mot de passe trop faible",
        description: "Veuillez choisir un mot de passe plus sécurisé",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signUp(email, password, { firstName });
      
      if (error) throw error;
      
      toast({
        title: "Compte créé",
        description: "Un email de confirmation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Impossible de créer votre compte. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Logo en haut à gauche avec espace pour image */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        <span className="text-2xl font-bold tracking-tight">arjan</span>
      </Link>
      
      {/* Section formulaire (gauche) */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">Prénom</label>
                <Input 
                  id="firstName" 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Votre prénom"
                  disabled={isLoading}
                />
              </div>
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
                {password && (
                  <div className="mt-1 space-y-1">
                    <Progress 
                      value={passwordStrength} 
                      className="h-2"
                      indicatorClassName={getPasswordStrengthColor()}
                    />
                    <p className="text-xs text-muted-foreground">
                      {passwordStrength <= 20 && "Très faible"}
                      {passwordStrength > 20 && passwordStrength <= 40 && "Faible"}
                      {passwordStrength > 40 && passwordStrength <= 60 && "Moyen"}
                      {passwordStrength > 60 && passwordStrength <= 80 && "Fort"}
                      {passwordStrength > 80 && "Très fort"}
                    </p>
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Création en cours..." : "S'inscrire"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full text-muted-foreground">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Se connecter
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

export default Register;
