<template>
  <div class="contact-container">
    <div class="contact-card">
      <h1>Contactez-nous</h1>
      <form @submit.prevent="handleSubmit" class="contact-form">
        <div class="form-group">
          <label for="name">Nom</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            required
          >
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            required
          >
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea 
            id="message" 
            v-model="formData.message" 
            required
            rows="5"
          ></textarea>
        </div>
        <button type="submit">Envoyer</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = async () => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      alert('Message envoyé avec succès!');
    } else {
      alert('Erreur lors de l\'envoi du message.');
    }
  } catch (error) {
    alert('Erreur lors de l\'envoi du message.');
  }
}
</script>

<style scoped>
.contact-container {
  min-height: 100vh;
  background-color: #FEFCFB;
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.contact-card {
  background-color: #FFD9DA;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

h1 {
  color: #89023E;
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Shrikhand', cursive;
}

.contact-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

label {
  color: #30343F;
  font-weight: bold;
}

input, textarea {
  padding: 0.5rem;
  border: 1px solid #30343F;
  border-radius: 5px;
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #EA638C;
}

button {
  background-color: #89023E;
  color: #FEFCFB;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #EA638C;
}
</style>
