
import { createRoot } from 'react-dom/client';
import { Suspense, lazy } from 'react';
import './index.css';

// Use lazy loading for App component for improved initial load time
const App = lazy(() => import('./App.tsx'));

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Chargement...</div>}>
    <App />
  </Suspense>
);
