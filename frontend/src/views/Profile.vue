<template>
  <div class="profile-page">
    <h1>Bienvenue, {{ user?.email }}</h1>
    <p>Voici vos informations :</p>
    <ul>
      <li>Email : {{ user?.email }}</li>
    </ul>
    <button @click="handleLogout">Se déconnecter</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref(JSON.parse(localStorage.getItem('user')));

const handleLogout = () => {
  localStorage.removeItem('user');
  router.push('/login');
};
</script>
  
  <style scoped>
  .profile {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
  }
  
  .profile h1 {
    text-align: center;
    color: #2e294e;
    margin-bottom: 20px;
  }
  
  .profile-info {
    margin-bottom: 20px;
    background-color: #ffffff;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  
  .profile-info p {
    margin: 0 0 10px;
    color: #590d22;
  }
  
  .btn-logout {
    width: 100%;
    padding: 10px;
    background-color: #d90368;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-logout:hover {
    background-color: #ffd400;
    color: #2e294e;
  }
  </style>
  