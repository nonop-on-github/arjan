
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Politique de confidentialité</CardTitle>
              <p className="text-muted-foreground">Dernière mise à jour : 8 juin 2025</p>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
                <p>
                  Chez Arjan, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. 
                  Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations 
                  lorsque vous utilisez notre application de gestion financière.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">2. Données collectées</h2>
                <h3 className="text-xl font-medium mb-2">2.1 Informations d'inscription</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Prénom et nom</li>
                  <li>Adresse email</li>
                  <li>Mot de passe (crypté)</li>
                </ul>
                
                <h3 className="text-xl font-medium mb-2 mt-4">2.2 Données financières</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Transactions financières (revenus et dépenses)</li>
                  <li>Catégories de dépenses</li>
                  <li>Canaux financiers (comptes bancaires, cartes, etc.)</li>
                  <li>Descriptions et montants des transactions</li>
                </ul>

                <h3 className="text-xl font-medium mb-2 mt-4">2.3 Données techniques</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Adresse IP</li>
                  <li>Type de navigateur et appareil</li>
                  <li>Cookies et données de session</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">3. Utilisation des données</h2>
                <p>Nous utilisons vos données pour :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fournir nos services de gestion financière</li>
                  <li>Personnaliser votre expérience utilisateur</li>
                  <li>Améliorer nos services et fonctionnalités</li>
                  <li>Assurer la sécurité de votre compte</li>
                  <li>Vous contacter pour des mises à jour importantes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">4. Partage des données</h2>
                <p>
                  Nous ne vendons, ne louons, ni ne partageons vos données personnelles avec des tiers, 
                  sauf dans les cas suivants :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Avec votre consentement explicite</li>
                  <li>Pour répondre à des obligations légales</li>
                  <li>Pour protéger nos droits et notre sécurité</li>
                  <li>Avec des prestataires de services tiers de confiance (hébergement, etc.)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">5. Sécurité des données</h2>
                <p>
                  Nous mettons en place des mesures de sécurité appropriées pour protéger vos données :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Chiffrement des données sensibles</li>
                  <li>Authentification sécurisée</li>
                  <li>Accès restreint aux données</li>
                  <li>Surveillance continue de la sécurité</li>
                  <li>Sauvegardes régulières</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">6. Vos droits</h2>
                <p>Conformément au RGPD, vous avez le droit de :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Accéder à vos données personnelles</li>
                  <li>Rectifier vos données inexactes</li>
                  <li>Supprimer vos données (droit à l'oubli)</li>
                  <li>Limiter le traitement de vos données</li>
                  <li>Transférer vos données (portabilité)</li>
                  <li>Vous opposer au traitement</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">7. Cookies</h2>
                <p>
                  Nous utilisons des cookies essentiels pour le fonctionnement de l'application, 
                  notamment pour maintenir votre session de connexion et vos préférences. 
                  Vous pouvez gérer les cookies dans les paramètres de votre navigateur.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">8. Conservation des données</h2>
                <p>
                  Nous conservons vos données aussi longtemps que votre compte est actif ou 
                  selon les besoins pour vous fournir nos services. Vous pouvez supprimer 
                  votre compte à tout moment depuis les paramètres de votre profil.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">9. Modifications</h2>
                <p>
                  Nous pouvons mettre à jour cette politique de confidentialité. 
                  Les modifications importantes vous seront notifiées par email ou 
                  via l'application.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">10. Contact</h2>
                <p>
                  Pour toute question concernant cette politique de confidentialité 
                  ou vos données personnelles, contactez-nous à : 
                  <strong> privacy@arjan.fr</strong>
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
