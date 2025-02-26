<script setup>
import { RouterView } from 'vue-router';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<style scoped>
/* Style global de l'application */
#app {
  font-family: 'Arial', sans-serif;
  background-color: #fff;
  color: #333;
  min-height: 100vh;
}

footer {
  background-color: #30343f;
  color: #fff;
  padding: 20px;
  text-align: center;
}
</style>
