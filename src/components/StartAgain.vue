<template>
  <v-dialog v-model="localVisible" persistent @close="closeDialog" max-width="500px">
    <v-card class="dialog-card">
      <v-card-actions class="dialog-close">
        <!-- Knappen til at lukke dialogen -->
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-actions>
      <v-card-title class="dialog-title">Katten er desværre død</v-card-title>
      <v-img
        :width="300"
        aspect-ratio="16/9"
        cover
        :src="require('@/assets/images/DeadCat.gif')" 
        class="dialog-image"
      ></v-img>
      <v-card-text class="dialog-text">
        <!-- Tekst, der viser hvornår man kan prøve igen -->
        <p>Prøv igen om <span>{{ daysLeft }}</span> dage og <span>{{ hoursLeft }}</span> timer</p>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          @click="restartGame" 
          :disabled="!canTryAgain" 
          class="try-again-button"
        ><!-- Den deaktiverer knap, hvis man ikke kan prøve igen. altså hvis tiden ikke er udløbet -->
          Prøv igen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    // Indgående prop for at bestemme synlighed af dialogen
    // isVisible: En boolean, der angiver, om dialogen skal vises (true) eller skjules (false).
    // Hvis isVisible er true, vises dialogen; hvis false, skjules den.
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      timer: null, // Timer til nedtælling
      countdown: 7 * 24 * 60 * 60, // 7 dage i sekunder
      //countdown: 10, // 10 sekunder til test
    };
  },
  computed: {
    localVisible: {
      get() {
        // Getter til at returnere lokal synlighed baseret på isVisible
        return this.isVisible;
      },
      set(value) {
        // Setter til at opdatere synlighed og sende event
        this.$emit('update:isVisible', value);
      },
    },
    daysLeft() {
      // Beregner hvor mange dage der er tilbage
      return Math.floor(this.countdown / (24 * 60 * 60));
    },
    hoursLeft() {
      // Beregner hvor mange timer der er tilbage
      return Math.floor((this.countdown % (24 * 60 * 60)) / 3600);
    },
    canTryAgain() {
      // Tjekker om man kan prøve igen
      return this.countdown <= 0;
    },
  },
  methods: {
    // Lukker dialogen
    closeDialog() {
      this.localVisible = false;
    },
    // Starter spillet igen
    restartGame() {
      this.closeDialog(); 
      this.$emit('restart-game'); // Sender et event for at genstarte spillet

    },
    // Starter nedtællingstimeren
    startTimer() {
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--; // Formindsker nedtællingen med 1 hver sekund
        } else {
          clearInterval(this.timer); // Stop timeren når nedtællingen når 0
        }
      }, 1000); 
    },
  },
  mounted() {
    this.startTimer(); // Starter timeren når komponenten er monteret
  },
  beforeUnmount() {
    clearInterval(this.timer); // Rydder timeren inden komponenten fjernes
  },
};
</script>


<style scoped>
.dialog-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dialog-close {
  display: flex;
  justify-content: flex-end;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin: 6px 0;
}

.dialog-image {
  margin: 0 auto; 
  border-radius: 8px; 
}

.dialog-text {
  text-align: center;
  font-size: 1rem;
  color: #555;
  margin: 6px;
}

.try-again-button {
    width: 50%;
    background-color: #4CAF50; 
    color: white; 
    font-weight: bold;
    border-radius: 8px;
    margin: 0 auto; 
}

.try-again-button:hover {
  background-color: #45a049; 
}

.try-again-button:disabled {
  background-color: #919191; 
  color: #272727; 
  cursor: not-allowed; 
}

</style>

     