
import { createRoot } from 'react-dom/client';
import { Suspense, lazy, StrictMode } from 'react';
import './index.css';

// Ajouter un composant de chargement plus élaboré
const LoadingScreen = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <img src="/arjanLogo.png" alt="Arjan Logo" className="w-16 h-16 animate-pulse" />
      <div className="text-xl font-medium">Chargement...</div>
    </div>
  </div>
);

// Use lazy loading for App component for improved initial load time
const App = lazy(() => import('./App'));

// Utilisation d'une fonction pour créer la racine React - évite les problèmes potentiels d'initialisation
const initializeApp = () => {
  const container = document.getElementById("root");
  if (!container) return;
  
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <Suspense fallback={<LoadingScreen />}>
        <App />
      </Suspense>
    </StrictMode>
  );
};

// S'assurer que le DOM est complètement chargé avant d'initialiser l'application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
