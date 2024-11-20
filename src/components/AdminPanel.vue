<!-- AdminPanel fungerer som en overordnet struktur til admin-relaterede funktioner -->

<template>
  <v-container class="admin-container" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <h1 class="my-4">Velkommen til Admin Panel</h1>
        <v-row justify="center" class="my-4">

         <v-col cols="12" sm="10" md="8" lg="6" xl="4">
          <v-btn-toggle class="my-4" mandatory > <!-- mandatory betyder, at en knap altid skal være valgt -->
            <!-- :to="{ path: '/admin/list' }" propen betyder, at knappen vil navigere til vue ruten /admin/list
            :exact="true" sikrer, at router-linken kun er aktiv, når den præcise rute matcher-->
            <v-btn
              :to="{ path: '/admin/list' }"
              :exact="true"
              color="green"
              large
              >
            alle billedenavne
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
        </v-row>
        <v-divider></v-divider>
        <!-- router-view er en vue-router placeholder komponent der vil vise de forskellige komponenter til adminpanelet (fx CatTextList) -->
        <router-view></router-view> 
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
