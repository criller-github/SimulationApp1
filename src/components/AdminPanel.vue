<template>
  <div class="admin-container">
    <h1>Admin Panel</h1>
    <nav>
      <router-link to="/admin/list">Liste over Katte Tekster</router-link>
      <router-link to="/admin/add">Tilføj Ny Tekst</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'AdminPanel',
};
</script>

<style scoped>
.admin-container {
  padding: 20px;
}
nav {
  margin-bottom: 20px;
}
nav a {
  margin-right: 15px;
}
</style>