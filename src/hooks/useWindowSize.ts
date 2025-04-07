
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSize = (): WindowSize => {
  // Valeur initiale pour éviter les erreurs SSR
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Définir le gestionnaire pour mettre à jour l'état
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('resize', handleResize);
    
    // Appelez le gestionnaire immédiatement pour mettre à jour l'état avec les dimensions initiales
    handleResize();

    // Nettoyer l'écouteur d'événement lors du démontage
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
