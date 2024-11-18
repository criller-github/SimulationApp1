<template>
<div>
    <h2>Administrator Side</h2>
    <form @submit.prevent="createCatText">
      <input v-model="newText.image_id" placeholder="Image ID" required />
      <input v-model="newText.text" placeholder="Tekst" required />
      <button type="submit">Opret Tekst</button>
    </form>
    <ul>
      <li v-for="text in catTexts" :key="text.id">
        {{ text.image_id }}: {{ text.text }}
        <button @click="deleteCatText(text.id)">Slet</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      catTexts: [],
      newText: {
        image_id: '',
        text: '',
      },
    };
  },
  methods: {
    async fetchCatTexts() {
      try {
        const response = await axios.get('http://localhost:8080/api/cattexts');
        this.catTexts = response.data;
      } catch (error) {
        console.error('Fejl ved hentning af CatTexts:', error);
      }
    },
    async createCatText() {
      try {
        await axios.post('http://localhost:8080/api/cattexts', this.newText);
        this.newText.image_id = '';
        this.newText.text = '';
        this.fetchCatTexts();
      } catch (error) {
        console.error('Fejl ved oprettelse af CatText:', error);
      }
    },
    async deleteCatText(id) {
      try {
        await axios.delete(`http://localhost:8080/api/cattexts/${id}`);
        this.fetchCatTexts();
      } catch (error) {
        console.error('Fejl ved sletning af CatText:', error);
      }
    },
  },
  created() {
    this.fetchCatTexts();
  },
};
</script>

