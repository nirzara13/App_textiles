<template>
  <div class="conditions-utilisation-container" role="main" aria-labelledby="page-title">
    <h1 id="page-title" class="page-title">Conditions Générales d'Utilisation</h1>
    
    <section class="section" aria-labelledby="objet-title">
      <h2 id="objet-title">Objet</h2>
      <div class="content-block">
        <p>Les présentes Conditions Générales d'Utilisation (CGU) définissent les règles d'utilisation de l'application "Un file & un style". En utilisant l'application, l'utilisateur accepte ces conditions.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="acces-title">
      <h2 id="acces-title">Accès à l'Application</h2>
      <div class="content-block">
        <p>L'accès à certaines fonctionnalités nécessite une inscription et une connexion :</p>
        <ul>
          <li>Consultation du catalogue de textiles (accessible à tous)</li>
          <li>Gestion des favoris (réservée aux utilisateurs connectés)</li>
          <li>Modification du profil et suppression du compte via le tableau de bord</li>
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="obligations-title">
      <h2 id="obligations-title">Obligations des Utilisateurs</h2>
      <div class="content-block">
        <p>Les utilisateurs s'engagent à :</p>
        <ul>
          <li>Fournir des informations exactes lors de leur inscription</li>
          <li>Ne pas utiliser l'application à des fins illégales ou abusives</li>
          <li>Respecter les droits d'autres utilisateurs et du propriétaire de l'application</li>
          <li>Ne pas tenter d'accéder aux données ou aux systèmes de l'application sans autorisation</li>
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="responsabilite-title">
      <h2 id="responsabilite-title">Limitation de Responsabilité</h2>
      <div class="content-block">
        <p>L'éditeur décline toute responsabilité en cas de :</p>
        <ul>
          <li>Mauvais usage de l'application par les utilisateurs</li>
          <li>Dysfonctionnement technique lié au développement en local</li>
          <li>Perte ou dommage causé par l'utilisation de l'application</li>
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="modification-title">
      <h2 id="modification-title">Modification des CGU</h2>
      <div class="content-block">
        <p>Ces Conditions Générales d'Utilisation peuvent être modifiées à tout moment dans le cadre du projet académique. Les utilisateurs seront informés via une mise à jour visible sur l'application.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="loi-title">
      <h2 id="loi-title">Loi Applicable</h2>
      <div class="content-block">
        <p>Les présentes Conditions Générales d'Utilisation sont régies par la loi française. Tout litige découlant de l'interprétation ou de l'exécution des présentes sera soumis aux tribunaux compétents du ressort de [Votre Ville].</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ConditionsUtilisation',
  metaInfo: {
    title: 'Conditions d\'Utilisation - Un file & un style',
    meta: [
      { 
        name: 'description', 
        content: 'Conditions générales d\'utilisation de l\'application Un file & un style' 
      }
    ]
  }
}
</script>

<style scoped>
.conditions-utilisation-container {
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

/* Accessibilité */
a:focus,
button:focus {
  outline: 3px solid #89023E;
  outline-offset: 2px;
}
</style>