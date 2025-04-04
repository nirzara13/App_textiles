<template>
  <div class="politique-confidentialite-container" role="main" aria-labelledby="page-title">
    <h1 id="page-title" class="page-title">Politique de Confidentialité</h1>
    
    <section class="section" aria-labelledby="introduction-title">
      <h2 id="introduction-title">Introduction</h2>
      <div class="content-block">
        <p>Nous nous engageons à protéger la vie privée des utilisateurs de notre application. Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons les informations personnelles.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="donnees-title">
      <h2 id="donnees-title">Données Collectées</h2>
      <div class="content-block">
        <p>Nous collectons les données suivantes :</p>
        <ul>
          <li>Adresse email (lors de l'inscription)</li>
          <li>Mot de passe (stocké sous forme hashée avec bcrypt)</li>
          <li>Informations liées aux favoris :
            <ul>
              <li>Fréquence d'utilisation</li>
              <li>Contexte</li>
              <li>Notes personnelles</li>
            </ul>
          </li>
          <li>Données de connexion (adresse IP, navigateur utilisé)</li>
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="utilisation-title">
      <h2 id="utilisation-title">Utilisation des Données</h2>
      <div class="content-block">
        <p>Les données collectées sont utilisées uniquement pour :</p>
        <ul>
          <li>Créer un compte et permettre la connexion</li>
          <li>Gérer le profil et les favoris des utilisateurs</li>
          <li>Stocker les informations personnelles liées aux textiles favoris</li>
          <li>Améliorer l'expérience utilisateur</li>
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="stockage-title">
      <h2 id="stockage-title">Stockage des Données</h2>
      <div class="content-block">
        <p>Les données sont stockées localement dans une base MySQL via Laragon. Aucune donnée n'est partagée avec des tiers sans consentement explicite.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="securite-title">
      <h2 id="securite-title">Sécurité des Données</h2>
      <div class="content-block">
        <p>Nous prenons des mesures raisonnables pour protéger les données contre :</p>
        <ul>
          <li>Perte</li>
          <li>Utilisation abusive</li>
          <li>Accès non autorisé</li>
          <li>Divulgation</li>
          <li>Altération</li>
          <li>Destruction</li>
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="droits-title">
      <h2 id="droits-title">Droits des Utilisateurs</h2>
      <div class="content-block">
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD), chaque utilisateur dispose des droits suivants :</p>
        <ul>
          <li>Accéder à ses données personnelles</li>
          <li>Modifier ou supprimer ses données via son tableau de bord</li>
          <li>Supprimer son compte et toutes ses données associées</li>
          <li>S'opposer au traitement de ses données pour des raisons légitimes</li>
        </ul>
        <p>Pour toute demande liée aux données personnelles, contactez-nous à l'adresse : protection-donnees@unfilestyle.com</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'PolitiqueConfidentialite',
  metaInfo: {
    title: 'Politique de Confidentialité - Un file & un style',
    meta: [
      { 
        name: 'description', 
        content: 'Politique de protection des données personnelles de l\'application Un file & un style' 
      }
    ]
  }
}
</script>

<style scoped>
.politique-confidentialite-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #FEFCFB;
  color: #1B2021;
  font-family: 'Shrikhand', cursive;
}

.page-title {
  color: #89023E;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  border-bottom: 3px solid #EA638C;
  padding-bottom: 0.5rem;
}

.section {
  margin-bottom: 2rem;
  background-color: #FFD9DA;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

h2 {
  color: #30343F;
  border-bottom: 2px solid #EA638C;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.content-block {
  line-height: 1.6;
}

ul {
  list-style-type: disc;
  padding-left: 2rem;
  margin-bottom: 1rem;
}

ul ul {
  list-style-type: circle;
  margin-top: 0.5rem;
}

/* Accessibilité */
a:focus,
button:focus {
  outline: 3px solid #89023E;
  outline-offset: 2px;
}
</style>