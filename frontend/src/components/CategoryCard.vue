<template>
  <div class="category-card">
    <img :src="image" alt="Fabric Image" class="category-card-img" />
    <h3 class="category-card-title">{{ name }}</h3>
    <p class="category-card-description">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  description: String,
  image: String
});
</script>

<style scoped>
.category-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.category-card:hover {
  transform: scale(1.05);
}

.category-card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.category-card-title {
  font-size: 1.25rem;
  padding: 10px;
  text-align: center;
}

.category-card-description {
  font-size: 1rem;
  padding: 10px;
  color: #555;
}
</style>
