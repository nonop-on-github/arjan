
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Politique de confidentialité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Collecte des données</h2>
              <p className="text-muted-foreground">
                Nous collectons uniquement les informations nécessaires au fonctionnement de notre service :
                votre adresse email, votre prénom, votre nom (optionnel), et les données financières que vous 
                saisissez dans l'application pour gérer vos finances personnelles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Utilisation des données</h2>
              <p className="text-muted-foreground">
                Vos données sont utilisées exclusivement pour :
              </p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                <li>Vous permettre d'accéder à votre compte</li>
                <li>Sauvegarder et synchroniser vos données financières</li>
                <li>Améliorer l'expérience utilisateur de notre application</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Protection des données</h2>
              <p className="text-muted-foreground">
                Nous utilisons des mesures de sécurité avancées pour protéger vos données. 
                Toutes les informations sont chiffrées et stockées de manière sécurisée sur 
                des serveurs européens via Supabase.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Partage des données</h2>
              <p className="text-muted-foreground">
                Nous ne partageons, ne vendons, ni ne louons vos données personnelles à des tiers. 
                Vos informations financières restent strictement confidentielles et ne sont 
                accessibles qu'à vous seul.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Cookies et technologies similaires</h2>
              <p className="text-muted-foreground">
                Nous utilisons des cookies techniques essentiels pour le fonctionnement de 
                l'application, notamment pour maintenir votre session de connexion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Vos droits</h2>
              <p className="text-muted-foreground">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement (suppression de compte)</li>
                <li>Droit à la portabilité de vos données</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Suppression de compte</h2>
              <p className="text-muted-foreground">
                Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre profil. 
                Cette action supprimera définitivement toutes vos données personnelles et financières.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question concernant cette politique de confidentialité ou pour exercer 
                vos droits, vous pouvez nous contacter via les paramètres de l'application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Modifications</h2>
              <p className="text-muted-foreground">
                Cette politique de confidentialité peut être mise à jour. Nous vous informerons 
                de tout changement significatif par email ou via l'application.
              </p>
            </section>

            <p className="text-sm text-muted-foreground mt-8">
              Dernière mise à jour : 5 juin 2025
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
