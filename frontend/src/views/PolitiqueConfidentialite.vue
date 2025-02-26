<template>
  <div class="privacy-page">
    <h1>Politique de Confidentialité</h1>
    <p>Cette politique de confidentialité s’applique au site : <strong>www.monsite.com</strong>.</p>
    
    <h2>1. Collecte des informations :</h2>
    <p>Nous recueillons des informations lorsque vous vous inscrivez sur notre site, lorsque vous vous connectez à votre compte, faites un achat, participez à un concours, et/ou lorsque vous vous déconnectez.</p>
    
    <h2>2. Utilisation des informations :</h2>
    <p>Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :</p>
    <ul>
      <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
      <li>Fournir un contenu publicitaire personnalisé</li>
      <li>Améliorer notre site</li>
      <li>Améliorer le service client et vos besoins de prise en charge</li>
      <li>Vous contacter par e-mail</li>
      <li>Administrer un concours, une promotion, ou une enquête</li>
    </ul>
    
    <h2>3. Confidentialité des informations :</h2>
    <p>Nous sommes les seuls propriétaires des informations recueillies sur ce site.</p>
  </div>
</template>

<script setup>
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400&family=Shrikhand&display=swap');

.privacy-page {
  background-color: #FEFCFB;
  color: #1B2021;
  font-family: 'Open Sans', sans-serif;
  font-weight: 300; /* Poids léger */
  padding: 20px;
  border-radius: 10px;
  margin: 20px auto;
  max-width: 800px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-in-out;
  line-height: 1.6; /* Espacement entre les lignes */
}

h1 {
  font-family: 'Shrikhand', cursive;
  color: #89023E;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600; /* Semi-bold */
}

h2 {
  font-family: 'Shrikhand', cursive;
  color: #30343F;
  margin-top: 20px;
  font-weight: 500; /* Medium */
}

p, ul {
  margin: 15px 0; /* Espacement entre les paragraphes */
  line-height: 1.6; /* Espacement entre les lignes */
}

ul {
  list-style-type: disc;
  padding-left: 40px;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
