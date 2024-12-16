<!-- AdminPanel fungerer som en overordnet struktur til admin-relaterede funktioner -->

<template>
 <v-container class="admin-container" fluid>
  <v-row justify="center">
    <v-col cols="12" md="12" class="text-center">
      <h1 class="my-4">Velkommen til Admin Panel</h1>

      <v-row justify="space-between" class="my-4">
        <!-- Første gruppe knapper -->
        <v-col cols="12" md="6" class="d-flex justify-md-end justify-center">
          <v-btn-toggle class="my-4" mandatory>
            <v-btn
              :to="{ path: '/admin/list' }"
              :exact="true"
              color="green"
              large
            >
              Alle Billedenavne
            </v-btn>
            <v-btn
              :to="{ path: '/admin/add' }"
              color="green"
              large
            >
              Tilføj Ny Tekst
            </v-btn>
          </v-btn-toggle>
        </v-col>

        <!-- Anden gruppe knapper -->
        <v-col cols="12" md="6" class="d-flex justify-md-start justify-center">
          <v-btn-toggle class="my-4" mandatory>
            <v-btn
              :to="{ path: '/admin/shop' }"
              color="blue"
              large
            >
              Alle Shop Items
            </v-btn>
            <v-btn
              :to="{ path: '/admin/shop/add' }"
              color="blue"
              large
            >
              Tilføj Nyt Shop Item
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      
      <v-divider></v-divider>
      
      <router-view></router-view> <!-- Her vises de forskellige komponenter afhængigt af hvilken knap der er trykket på -->
    </v-col>
  </v-row>
</v-container>

</template>

<script>
export default {
  name: 'AdminPanel', // navnet på komponenten der kan bruges til fx fejlfinding
};
</script>

<style scoped>
.admin-container {
  min-height: 100vh; /* Sørger for at containeren altid fylder hele skærmen */
}
</style>
