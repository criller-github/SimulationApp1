<template>
  <div class="app-container">
    <div class="header-container">
      <button id="helpButton" @click="useHelp">?</button>
      <h2>KATTESIMULATOR</h2>
      <div>
        <i class="fa-solid fa-money-bills fa-2x" style="color: #f0626e"></i>
        <p>{{ money }}kr</p>
      </div>
    </div>
    <div id="livesContainer">
      <div class="life" v-for="(life, index) in lives" :key="index"></div>
    </div>

    <p v-if="message" class="message">{{ message }}</p>

    <div class="alert" v-if="alertMessage">
      <p>{{ alertMessage }}</p>
      <button @click="dismissAlert"></button>
    </div>

    <div class="cat-container">
      <img :src="catGif" alt="Cat" class="cat-image">
    </div>

    <div class="icon-container">
      <button class="icon-box" @click="fodring"><i class="fa-solid fa-bowl-food fa-2x"></i></button>
      <button class="icon-box" @click="Kattebakke"><i class="fa-solid fa-toilet fa-2x"></i></button>
      <button class="icon-box" @click="Leg"><i class="fa-solid fa-heart fa-2x"></i></button>
      <button class="icon-box" @click="Pleje"><i class="fa-solid fa-suitcase-medical fa-2x"></i></button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const initialLives = 9;
    const lives = ref(Array(initialLives).fill(null));
    const message = ref('');
    const alertMessage = ref('');
    const alertTimeout = ref(null);
    const money = ref(300);
    const catGif = ref(require('@/assets/cat.gif')); // Default gif

    const handleLifeLoss = () => {
      if (lives.value.length > 0) {
        lives.value.pop();
        alertMessage.value = "Du har mistet et liv!";
      } else {
        alertMessage.value = "Ingen liv tilbage!";
      }
    };

    const resetAlertTimeout = () => {
      clearTimeout(alertTimeout.value);
      alertTimeout.value = setTimeout(() => {
        handleLifeLoss();
      }, 3600000);
    };

    const showAlert = (message) => {
      alertMessage.value = message;
      resetAlertTimeout();
    };

    const dismissAlert = () => {
      alertMessage.value = '';
      clearTimeout(alertTimeout.value);
    };

    const fodring = () => {
      if (money.value >= 20) {
        money.value -= 20;
        alertMessage.value = "Fodring udført! -20 kr";
        catGif.value = require('@/assets/cat.gif'); // Skift gif til fodring
      } else {
        alertMessage.value = "Ikke nok penge til fodring!";
      }
      setTimeout(() => {
        alertMessage.value = "";
        catGif.value = require('@/assets/cat.gif'); // Gå tilbage til standard gif
      }, 5000);
    };

    const Kattebakke = () => {
      alertMessage.value = "Rengøring af kattebakke udført!";
      catGif.value = require('@/assets/cat.gif'); // Skift gif til kattebakke
      setTimeout(() => {
        alertMessage.value = "";
        catGif.value = require('@/assets/cat.gif'); // Gå tilbage til standard gif
      }, 5000);
    };

    const Leg = () => {
      alertMessage.value = "Leg udført!";
      catGif.value = require('@/assets/catLeg.gif'); // Skift gif til leg
      setTimeout(() => {
        alertMessage.value = "";
        catGif.value = require('@/assets/cat.gif'); // Gå tilbage til standard gif
      }, 5000);
    };

    const Pleje = () => {
      alertMessage.value = "Pleje udført!";
      catGif.value = require('@/assets/cat.gif'); // Skift gif til pleje
      setTimeout(() => {
        alertMessage.value = "";
        catGif.value = require('@/assets/cat.gif'); // Gå tilbage til standard gif
      }, 5000);
    };

    const useHelp = () => {
      message.value = "Dette er en hjælpetekst!";
      setTimeout(() => {
        message.value = "";
      }, 5000);
      handleLifeLoss();
    };

    const startRandomAlerts = () => {
      const showFeedingAlert = () => {
        showAlert("Tid til fodring!");
        setTimeout(showFeedingAlert, getRandomInterval(3));
      };

      const showLitterBoxAlert = () => {
        showAlert("Tid til at tømme kattebakken!");
        setTimeout(showLitterBoxAlert, getRandomInterval(0.25));
      };

      const showCareAlert = () => {
        showAlert("Tid til pleje!");
        setTimeout(showCareAlert, getRandomInterval(1));
      };

      const showPlayAlert = () => {
        showAlert("Tid til leg!");
        setTimeout(showPlayAlert, getRandomInterval(2));
      };

      showFeedingAlert();
      showLitterBoxAlert();
      showCareAlert();
      showPlayAlert();
    };

    const getRandomInterval = (timesPerDay) => {
      if (timesPerDay <= 0) return 0;
      const min = (24 / timesPerDay) * 60 * 60 * 1000 * 0.5;
      const max = (24 / timesPerDay) * 60 * 60 * 1000 * 1.5;
      return Math.floor(Math.random() * (max - min) + min);
    };

    //const getRandomInterval = () => {
    //return 5000; // Sæt intervallet til 5 sekunder for hurtigere test
    //};

    onMounted(() => {
      startRandomAlerts();
    });

    return {
      lives,
      message,
      useHelp,
      fodring,
      Kattebakke,
      Leg,
      Pleje,
      alertMessage,
      dismissAlert,
      money,
      catGif, // Bind gif data til skærmen
    };
  }
};
</script>


<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  height: 100vh;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

#helpButton {
  background-color: #ffdddd;
  border: 2px solid #f0626e;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 18px;
  font-weight: bold;
  color: #f0626e;
  cursor: pointer;
}

#livesContainer {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.life {
  width: 15px;
  height: 15px;
  background-color: #f0626e;
  border-radius: 50%;
  margin: 0 5px;
}

.message {
  color: #555;
  font-size: 14px;
  margin-top: 10px;
}

.cat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.cat-image {
  width: 190px;
  height: auto;
}


.icon-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.icon-box {
  width: 40px;
  height: 40px;
  background-color: #ffcccc;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.icon-image {
  width: 24px;
  height: 24px;
}

.alert {
  background-color: #fff3cd;
  color: #856404;
  padding: 10px;
  border: 1px solid #ffeeba;
  border-radius: 5px;
  margin: 10px 0;
}

</style>
