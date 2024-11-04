<!-- viser beskeder til brugeren -->
<template>
<!--
<v-snackbar>:
- En Vuetify-komponent, der viser midlertidige beskeder i bunden af skærmen

v-model="visible":
- to-vejs binding til visible dataen, der bestemmer om snackbaren skal vises eller ej
- når visible er true, vises snackbaren; når den automatisk lukker, sættes visible til false

:timeout="3000":
- binder timeout attributten til 3000 millisekunder (3 sekunder)
- bestemmer hvor længe snackbaren vises, før den automatisk lukker 

{{ message }}:
interpolation viser beskeden, der er sendt via message prop-->
  <v-snackbar v-model="visible" :timeout="3000">
    {{ message }}
  </v-snackbar>
</template>

<script>
export default {
  name: 'NotificationComponent',
  props: {
    message: String, // modtager beskeden fra parent (Home.vue)
  },
  data() {
    return {
      visible: true, // styrer synligheden af snackbaren
    };
  },
  watch: { // en watcher, der lytter efter ændringer i message prop
    message() {
        // når message ændres (dvs. der kommer en ny besked), sættes visible til true, så snackbaren vises igen
      this.visible = true;
    },
  },
};
</script>