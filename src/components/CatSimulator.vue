<template>
  <div class="app-container">
    <div class="header-container">
      <button id="helpButton" @click="useHelp">?</button>
      <h2>KATTESIMULATOR</h2>
      <div><i class="fa-solid fa-money-bills fa-2x" style="color: #f0626e"></i>
      <p>{{ money }}kr</p>
      </div>
    </div>
    <div id="livesContainer">
      <div class="life" v-for="(life, index) in lives" :key="index"></div>
    </div>

    <p v-if="message" class="message">{{ message }}</p>

    <div class="alert" v-if="alertMessage">
      <p>{{ alertMessage }}</p>
      <button @click="dismissAlert"></button> <!-- Add a button to dismiss the alert -->
    </div>

    <div class="cat-container">
        <iframe src="https://giphy.com/embed/H6Yv2GsSjBSnArRtfa" width="480" height="353" style="" frameBorder="0" class="giphy-embed cat-image" allowFullScreen></iframe>
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
    const alertTimeout = ref(null); // New state for alert timeout
    const money = ref(300);

    const handleLifeLoss = () => {
      if (lives.value.length > 0) {
        lives.value.pop(); // Remove a life
        alertMessage.value = "Du har mistet et liv!";
      } else {
        alertMessage.value = "Ingen liv tilbage!";
      }
    };

    const resetAlertTimeout = () => {
      clearTimeout(alertTimeout.value); // Clear previous timeout
      alertTimeout.value = setTimeout(() => {
        handleLifeLoss(); // Lose a life if no response after 1 hour
      }, 3600000); // 1 hour in milliseconds
    };

    const showAlert = (message) => {
      alertMessage.value = message;
      resetAlertTimeout(); // Start the alert timeout when showing a new alert
    };

    const dismissAlert = () => {
      alertMessage.value = ''; // Clear the alert
      clearTimeout(alertTimeout.value); // Clear the timeout when responding
    };

    const fodring = () => {
      if (money.value >= 20) {
        money.value -= 20;
        alertMessage.value = "Fodring udført! -20 kr";
      } else {
        alertMessage.value = "Ikke nok penge til fodring!";
      }

      setTimeout(() => {
        alertMessage.value = "";
      }, 5000);
    };

    const Kattebakke = () => {
      alertMessage.value = "Rengøring af kattebakke udført!";
      setTimeout(() => {
        alertMessage.value = "";
      }, 5000);
    };

    const Leg = () => {
      alertMessage.value = "Leg udført!";
      setTimeout(() => {
        alertMessage.value = "";
      }, 5000);
    };

    const Pleje = () => {
      alertMessage.value = "Pleje udført!";
      setTimeout(() => {
        alertMessage.value = "";
      }, 5000);
    };

    const useHelp = () => {
      message.value = "Dette er en hjælpetekst!";
      setTimeout(() => {
        message.value = "";
      }, 5000);
      handleLifeLoss(); // Lose a life when using help
    };

    const startRandomAlerts = () => {
      // Fodring 3 gange dagligt
      setInterval(() => {
        showAlert("Tid til fodring!");
      }, getRandomInterval(3));

      // Kattebakke 1-2 gange om ugen
      setInterval(() => {
        showAlert("Tid til at tømme kattebakken!");
      }, getRandomInterval(0.25)); // Ca. hver 2-4 dag

      // Pleje 1 gang dagligt
      setInterval(() => {
        showAlert("Tid til pleje!");
      }, getRandomInterval(1));

      // Leg 2 gange dagligt
      setInterval(() => {
        showAlert("Tid til leg!");
      }, getRandomInterval(2));
    };

    const getRandomInterval = (timesPerDay) => {
      const min = (24 / timesPerDay) * 60 * 60 * 1000 * 0.5; // Halvdelen af gennemsnitstiden
      const max = (24 / timesPerDay) * 60 * 60 * 1000 * 1.5; // 1.5 gange gennemsnitstiden
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
  width: 100px;
  height: auto;
}

.speech-bubble {
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
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
