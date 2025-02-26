<template>
    <div class="terms-page">
      <h1>Conditions d'Utilisation</h1>
      <p>Les présentes conditions d'utilisation sont conclues entre le propriétaire du site internet <strong>www.monsite.com</strong> et l’utilisateur.</p>
      
      <h2>1. Acceptation des conditions :</h2>
      <p>En accédant à ce site, vous acceptez sans réserve les présentes conditions d'utilisation.</p>
      
      <h2>2. Utilisation du site :</h2>
      <p>Vous vous engagez à ne pas utiliser ce site à des fins illégales ou interdites par les lois ou règlements en vigueur.</p>
      
      <h2>3. Limitation de responsabilité :</h2>
      <p>Le propriétaire du site ne pourra être tenu pour responsable des dommages directs et indirects causés au matériel de l’utilisateur, lors de l’accès au site <strong>www.monsite.com</strong>.</p>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400&family=Shrikhand&display=swap');
  
  .terms-page {
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
  
  p {
    margin: 15px 0; /* Espacement entre les paragraphes */
    line-height: 1.6; /* Espacement entre les lignes */
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
  