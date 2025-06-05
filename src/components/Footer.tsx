
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t mt-auto py-4">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <span>© 2025 Arjan. Tous droits réservés.</span>
          <span>Made with ❤️ in France by @nonooop</span>
          <Link 
            to="/privacy-policy" 
            className="text-primary hover:underline"
          >
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
