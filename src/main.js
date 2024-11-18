// src/main.js
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

import App from './App.vue';
import StartSimulator from './components/StartSimulator.vue';
import Home from './view/Home.vue';
import Admin from './components/Admin.vue';

// Importer ikonkomponenten
import SvgIcon from '@jamescoyle/vue-icon';

// Indlæs skrifttyper
loadFonts();

// Definér routeren og ruterne
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: StartSimulator }, // StartSimulator ved rodstien
    { path: '/simulator-home', component: Home }, // Home ruten
    { path: '/admin', component: Admin }, // Admin ruten
  ]
});

// Opret appen og brug Vuetify og routeren
const app = createApp(App);

app.use(vuetify);
app.use(router);
app.component('SvgIcon', SvgIcon);  // Registrer ikonkomponenten globalt

app.mount('#app');

