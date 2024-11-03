<!-- src/App.vue -->
<template>
  <v-app>
    <v-main>
      <!-- Brug router-view til dynamisk at vise den aktuelle rute-komponent -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App'
};
</script>
