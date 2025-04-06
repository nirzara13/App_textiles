<template>
  <div class="mentions-legales-container" role="main" aria-labelledby="page-title">
    <h1 id="page-title" class="page-title">Mentions Légales</h1>
    
    <section class="section" aria-labelledby="editeur-title">
      <h2 id="editeur-title">Éditeur de l'Application</h2>
      <div class="content-block">
        <p><strong>Nom de l'application :</strong> Un file & un style</p>
        <p><strong>Responsable de la publication :</strong> Nirzara BARUA</p>
        <p><strong>Adresse :</strong> 69 R. de Turbigo, 75003 Paris</p>
        <p><strong>Email :</strong> contact@unfilestyle.com</p>
        <p><strong>Numéro de téléphone :</strong> +33 (0)1 23 45 67 89</p>
      </div>
    </section>

    <section class="section" aria-labelledby="hebergement-title">
      <h2 id="hebergement-title">Hébergement</h2>
      <div class="content-block">
        <p>L'application est hébergée localement dans le cadre d'un projet académique de BTS Services Informatiques aux Organisations (SIO). Aucun hébergeur tiers n'est utilisé pour ce projet.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="propriete-title">
      <h2 id="propriete-title">Propriété Intellectuelle</h2>
      <div class="content-block">
        <p>Tous les contenus présents sur l'application (textes, images, logos, etc.) sont protégés par les lois sur la propriété intellectuelle. Toute reproduction, modification ou distribution sans autorisation préalable est strictement interdite.</p>
        <p>Les marques et logos utilisés sont la propriété exclusive de leurs détenteurs respectifs.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="responsabilite-title">
      <h2 id="responsabilite-title">Responsabilité</h2>
      <div class="content-block">
        <p>L'application est développée dans un cadre académique et n'est pas destinée à une utilisation commerciale. L'éditeur décline toute responsabilité en cas de dysfonctionnement ou d'erreur liée au code ou aux données.</p>
        <p>Les utilisateurs utilisent l'application à leurs propres risques.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="loi-title">
      <h2 id="loi-title">Loi Applicable</h2>
      <div class="content-block">
        <p>Les présentes mentions légales sont régies par la loi française. Tout litige découlant de l'interprétation ou de l'exécution des présentes sera soumis aux tribunaux compétents du ressort de Paris.</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'MentionsLegales',
  metaInfo: {
    title: 'Mentions Légales - Un file & un style',
    meta: [
      { 
        name: 'description', 
        content: 'Mentions légales de l\'application Un file & un style, projet académique de BTS SIO' 
      }
    ]
  }
}
</script>

<style scoped>
.mentions-legales-container {
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

/* Accessibilité */
a:focus,
button:focus {
  outline: 3px solid #89023E;
  outline-offset: 2px;
}
</style>