<!-- siden der "søger" efter en ny kat, når brugeren har opbrugt alle kattens liv -->
<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
    <div class="dialog-card">
      <v-card-title class="dialog-title">Vi leder efter en ny kat til dig</v-card-title>

      <v-img
        :width="300"
        aspect-ratio="16/9"
        cover
        :src="require('@/assets/images/CatAssembly.gif')" 
        class="dialog-image"
      ></v-img>

      <v-card-text class="dialog-text">
      <p>Prøv igen om {{ minutesLeft }} minutter og {{ secondsLeft }} sekunder</p>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          @click="restartGame" 
          :disabled="!canTryAgain" 
          class="try-again-button"
        >
          Prøv igen
        </v-btn>
      </v-card-actions>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'CatSearch',
  data() {
    return {
        //countdown: 60, // 1 minut i sekunder, til test
        countdown: 10, // 
      timer: null, // Timer til nedtælling
    };
    
  },
  computed: {
    minutesLeft() {
      return Math.floor(this.countdown / 60); // Minutter tilbage
    },
    secondsLeft() {
      return this.countdown % 60; // Sekunder tilbage
    },
    canTryAgain() {
      return this.countdown <= 0;
    },
  },
  methods: {
    restartGame() {
      // Rydder spillets tilstande i localStorage
      localStorage.removeItem('catDay');
      localStorage.removeItem('catStatus');
      localStorage.removeItem('currentProblem');
      localStorage.removeItem('lives');
      localStorage.removeItem('money');

      // Navigere til simulator-home uden at genindlæse siden
      this.$router.push('/simulator-home');
    },
    startTimer() {
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--; // Tæl ned
        } else {
          clearInterval(this.timer); // Stop timeren når countdown er 0
        }
      }, 1000); 
    },
  },
  mounted() {
    this.startTimer(); // Start timeren når komponenten er monteret
  },
  beforeUnmount() {
    clearInterval(this.timer); // Ryd timeren inden komponenten fjernes
  },
};
</script>

<style scoped>
.dialog-card {  
  overflow: hidden;
  border: none !important;
  
}


.dialog-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  color: #000;
  margin: 6px 0;
}

.dialog-image {
  margin: 0 auto; 
  border-radius: 8px; 
}

.dialog-text {
  text-align: center;
  font-size: 1rem;
  color: #000;
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

