// src/main.js
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

import App from './App.vue';
import StartSimulator from './components/StartSimulator.vue';
import Home from './view/Home.vue';
import CatSearch from './components/CatSearch.vue';

import AdminPanel from './components/AdminPanel.vue'; // Opdateret import
import CatTextList from './components/CatTextList.vue';
import AddCatText from './components/AddCatText.vue';
import CatText from './components/CatText.vue';

import SvgIcon from '@jamescoyle/vue-icon';

// Indlæs skrifttyper
loadFonts();

// Definér routeren og ruterne
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: StartSimulator }, // StartSimulator ved rodstien
    { path: '/simulator-home', component: Home }, // Home ruten
    { path: '/cat-search', component: CatSearch, name: 'cat-search' }, // CatSearch ruten
    // Admin ruter med `AdminPanel` som overordnet komponent
    {
      path: '/admin',
      component: AdminPanel, // Opdateret komponent
      children: [
        { path: '', redirect: '/admin/list' }, // Standard route
        { path: 'list', component: CatTextList, name: 'cattexts' },
        { path: 'add', component: AddCatText, name: 'add-cattext' },
        { path: ':id', component: CatText, name: 'cattext-details' },
      ],
    },
  ],
});

// Opret appen og brug Vuetify og routeren
const app = createApp(App);

app.use(vuetify);
app.use(router);
app.component('SvgIcon', SvgIcon); // Registrer ikonkomponenten globalt

app.mount('#app');
