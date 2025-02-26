<template>
  <div class="favorites">
    <h2>Mes Favoris</h2>
    <ul v-if="favorites.length">
      <li v-for="favorite in favorites" :key="favorite.id">{{ favorite.name }}</li>
    </ul>
    <p v-else>Aucun favori pour le moment</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      favorites: []
    };
  },
  async mounted() {
    const response = await fetch('http://localhost:3000/favorites', {
      method: 'GET',
      credentials: 'include'
    });
    if (response.ok) {
      this.favorites = await response.json();
    } else {
      alert('Erreur lors du chargement des favoris');
    }
  }
};
</script>

<style scoped>
.favorites {
  text-align: center;
  margin-top: 50px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
}
</style>
