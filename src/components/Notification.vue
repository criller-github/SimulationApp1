<!-- viser beskeder til brugeren -->
<template>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      absolute
      top
      color="green lighten-3"
      class="snackbarMove"
    >
      {{ message }}

      <template v-slot:actions>
      </template>
    </v-snackbar>
</template>

<script>
export default {
  name: 'NotificationComponent',
  props: {
    message: String, // modtager beskeden fra parent (Home.vue)
  },
    data: () => ({
      snackbar: false,
    }),
  watch: { //for at kunne åbne snackbaren automatisk benytter vi en watcher til at lytte efter ændringer i message
    message(newVal) {
      if (newVal) {
      this.snackbar = true;
    } else { //for at kunne lukke snackbaren når 'message' bliver tom, kan vi bruge en else statement
      this.snackbar = false;
    }
    },
  },
};
</script>

<style scoped>
.snackbarMove {
   top: 200px; /* top placering virker ikke */
}
</style>