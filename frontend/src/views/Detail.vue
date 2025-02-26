<template>
    <div class="detail-container">
      <h1>{{ material.name }}</h1>
      <img :src="material.image" alt="Matière Textile" class="detail-img" />
      <p>{{ material.description }}</p>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const material = ref({});
  
  onMounted(() => {
    const materialName = route.params.materialName;  // Récupérer le paramètre de l'URL
    // Utilise un tableau ou une API pour récupérer les données de la matière
    const materials = {
      coton: {
        name: 'Coton',
        image: 'https://via.placeholder.com/400',
        description: 'Matière naturelle douce et confortable.',
      },
      polyester: {
        name: 'Polyester',
        image: 'https://via.placeholder.com/400',
        description: 'Matière synthétique résistante et peu coûteuse.',
      },
      laine: {
        name: 'Laine',
        image: 'https://via.placeholder.com/400',
        description: 'Matière chaude, idéale pour l\'hiver.',
      },
    };
    material.value = materials[materialName];  // Charger les données de la matière selon le nom
  });
  </script>
  
  <style scoped>
  .detail-container {
    padding: 20px;
  }
  
  .detail-img {
    width: 100%;
    height: auto;
  }
  </style>
  