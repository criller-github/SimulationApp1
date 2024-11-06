<!-- viser beskeder til brugeren -->
<template>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      absolute
      color="green-lighten-1"
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