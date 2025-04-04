
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const EmailConfirmed = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2">
        <img src="/arjanLogo.png" alt="Arjan Logo" className="w-8 h-8 rounded-md" />
        <span className="text-2xl font-bold tracking-tight">arjan</span>
      </Link>
      
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold">Email confirmé avec succès !</h1>
        
        <p className="text-muted-foreground">
          Votre adresse email a été confirmée. Vous pouvez maintenant vous connecter à votre compte.
        </p>
        
        <Button onClick={handleNavigateToLogin} className="w-full">
          Se connecter
        </Button>
      </Card>
    </div>
  );
};

export default EmailConfirmed;
