<template>
  <div class="app-container">
    <div class="header-container">
      <button id="helpButton" @click="useHelp">?</button>
      <h2>KATTESIMULATOR</h2>
    </div>
    <div id="livesContainer">
      <div class="life" v-for="(life, index) in lives" :key="index"></div>
    </div>

    <p v-if="message" class="message">{{ message }}</p>

    <div class="cat-container">
        <iframe src="https://giphy.com/embed/H6Yv2GsSjBSnArRtfa" width="480" height="353" style="" frameBorder="0" class="giphy-embed cat-image" allowFullScreen></iframe><p><a href="https://giphy.com/stickers/cat-love-cats-H6Yv2GsSjBSnArRtfa"></a></p>
        <div class="speech-bubble" v-if="showSpeechBubble">{{ currentSpeech }}</div>
    </div>

     <div class="icon-container">
      <div class="icon-box" v-for="(icon, index) in icons" :key="index" v-html="icon"></div>
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
    const showSpeechBubble = ref(true);
    const currentSpeech = ref('');
    const icons = [
    '<i class="fa-solid fa-bowl-food fa-2x"></i>',  
    '<i class="fa-solid fa-toilet fa-2x"></i>',     
    '<i class="fa-solid fa-heart fa-2x"></i>',        
    '<i class="fa-solid fa-suitcase-medical fa-2x"></i>'       
];

    const useHelp = () => {
      message.value = "Dette er en hjælpetekst!";
      if (lives.value.length > 0) {
        lives.value.pop();
      } else {
        message.value = "Ingen liv tilbage!";
      }
    };

    // Funktioner til at vise alerts for forskellige opgaver
    const showAlert = (message) => {
      alert(message);
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

    // Beregn tilfældige intervaller for opgaver (i ms)
    const getRandomInterval = (timesPerDay) => {
      const min = (24 / timesPerDay) * 60 * 60 * 1000 * 0.5; // Halvdelen af gennemsnitstiden
      const max = (24 / timesPerDay) * 60 * 60 * 1000 * 1.5; // 1.5 gange gennemsnitstiden
      return Math.floor(Math.random() * (max - min) + min);
    };

    onMounted(() => {
      startRandomAlerts();
    });

    return {
      lives,
      message,
      useHelp,
      showSpeechBubble,
      currentSpeech,
      icons
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
</style>
