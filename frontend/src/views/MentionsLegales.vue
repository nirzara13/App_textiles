<template>
    <div class="legal-page">
      <h1>Mentions Légales</h1>
      <p>Conformément aux dispositions des articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l’économie numérique, dite L.C.E.N., nous portons à la connaissance des utilisateurs et visiteurs du site : <strong>www.monsite.com</strong> les informations suivantes :</p>
      
      <h2>1. Informations légales :</h2>
      <p>
        Statut du propriétaire : <br>
        Propriétaire du site : MonSite <br>
        Responsable de la publication : M. Dupont - contact@monsite.com <br>
        Conception et développement : MonSite Team <br>
        Hébergeur : OVH - 2 rue Kellermann 59100 Roubaix
      </p>
      
      <h2>2. Conditions d'utilisation :</h2>
      <p>L’utilisation du site <strong>www.monsite.com</strong> implique l’acceptation pleine et entière des conditions générales d’utilisation ci-après décrites.</p>
      
      <h2>3. Services fournis :</h2>
      <p>Le site <strong>www.monsite.com</strong> a pour objet de fournir une information concernant l’ensemble des activités de la société.</p>
      
      <h2>4. Propriété intellectuelle :</h2>
      <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de : MonSite.</p>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400&family=Shrikhand&display=swap');
  
  .legal-page {
    background-color: #FEFCFB;
    color: #1B2021;
    font-family: 'Open Sans', sans-serif;
    font-weight: 300; /* Réduire le poids de la police */
    padding: 20px;
    border-radius: 10px;
    margin: 20px auto;
    max-width: 800px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    animation: fadeIn 1s ease-in-out;
    line-height: 1.6; /* Ajouter de l'espace entre les lignes */
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
    margin: 15px 0; /* Ajouter de l'espace entre les paragraphes */
    line-height: 1.6; /* Ajouter de l'espace entre les lignes */
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
  