<!-- viser kattens billede baseret på dens tilstand -->
<template>
  <div
  class="cat-container"
  @click="playMeow">
  <img :src="catImage" :style="{ transform: 'scale(' + catSize + ')' }" alt="" class="cat-image" />
</div>
</template>

<script>
import CatTextDataService from "@/services/CatTextDataService"; //Importerer CatTextDataService fra services-mappen

export default {
  name: 'CatComponent', //Komponentens navn
  props: {
    status: Object, // Modtager kattens status fra the parent (Home.vue)
    catSize: { // Modtager kattens størrelse som prop fra forælderen
        type: Number, 
        default: 1, // Standard størrelse
      },
    currentProblem: { // Modtager det aktuelle problem fra forælderen(home.vue)
    type: String,  // Typen er en streng fordi det er en tekst (hunger, happiness, hygiene, injured)
    default: null, // Standardværdi er null fordi der ikke er noget aktuelt problem i starten
  },
  },
  data() {
    return {
      meowSound: null,
      catText: '', //gemmer den tekst, der hentes fra backenden
      lastImageId: "", //gemmer det sidste imageId, der blev brugt til at hente tekst
    };
  },
  computed: {
  catImage() {
    if (!this.currentProblem) {
      // Hvis der ikke er et aktuelt problem så bliver standardbilledet vist
      return require('@/assets/images/CatT.gif');
    }

    // Få niveauet for det aktuelle problem
    // Hvis det aktuelle problem er 'injured', så brug 'injured' fra status-objektet
    const problemLevel = this.currentProblem === 'injured' ? (this.status.injured ? 0 : 100) : this.status[this.currentProblem];

    // Tjek om problemets niveau er under 75
    if (problemLevel < 99) {
      // Bestem billedet baseret på `currentProblem` og dets niveau
      switch (this.currentProblem) { //Switch-case statement, der bestemmer billedet baseret på kattens tilstand
        case 'hunger':
          return require('@/assets/images/HungryCatT.gif');
        case 'happiness':
          return require('@/assets/images/SadCatT.gif');
        case 'hygiene':
          // Vis forskellige billeder baseret på hygiejneniveauet
          if (problemLevel < 25) {
            return require('@/assets/images/DirtyCat_Level4.gif'); // Meget beskidt
          } else if (problemLevel < 50) {
            return require('@/assets/images/DirtyCat_Level3.gif'); // Beskidt
          } else if (problemLevel < 99) {
            return require('@/assets/images/DirtyCat_Level2.gif'); // Let beskidt
          } else {
            return require('@/assets/images/CatT.gif'); // Lidt beskidt
          }
        case 'injured':
          // Vis forskellige billeder baseret på om katten er skadet eller ej
          if (this.status.injured) {
            return require('@/assets/images/InjuredCatT.gif');
          } else {
            return require('@/assets/images/CatT.gif');
          }
        default:
          return require('@/assets/images/CatT.gif');
      }
    } else {
      // Hvis problemets niveau er 50 eller højere, vis standardbilledet
      return require('@/assets/images/CatT.gif');
    }
  },
  

   imageId() {
      //Beregner et imageId baseret på kattens tilstand, som vi bruger til at hente den korrekte tekst fra backenden
      if (!this.currentProblem) {
      return 'happy_cat';
    }

    // Få niveauet for det aktuelle problem
    const problemLevel = this.currentProblem === 'injured' ? (this.status.injured ? 0 : 100) : this.status[this.currentProblem];

    // Returner et imageId baseret på problemets niveau
    if (problemLevel < 50) {
      switch (this.currentProblem) { //Switch-case statement, der bestemmer billedet baseret på kattens tilstand
        case 'hunger': // Hvis katten er sulten
          return 'hungry_cat';
        case 'happiness':
          return 'sad_cat';
        case 'hygiene':
          return 'dirty_cat';
        case 'injured':
          return this.status.injured ? 'injured_cat' : 'happy_cat'; // Hvis katten er skadet, returneres 'injured_cat', ellers 'happy_cat'
        default:
          return 'happy_cat';
      }
    } else {
      return 'happy_cat';
    }
  },
},
  methods: {
    // Håndterer når en handling droppes hen på katten
    
    playMeow() {
          // Nulstil lyden, hvis den allerede afspilles (for at undgå overlap hvis brugeren klikker flere gange hurtigt)
      this.meowSound.play();
    },
    // Henter tekst fra backenden baseret på kattens tilstand
     async fetchCatText() {
      try {
        const response = await CatTextDataService.findByImageId(this.imageId); //et KPI kald der henter tekst fra backenden baseret på imageId, og imageId beregnes fra kattens tilstand via en computed property
        if (response.data.length > 0) { //Hvis der findes data for imageId, sættes this.catText til den tekst, der returneres af API'en
          this.catText = response.data[0].text; //Sætter catText til den tekst, der returneres af API'en
          this.$emit("show-notification", this.catText); //Emitter en custom event til parent (Home.vue) for at vise en notifikation med teksten
        } else { //Hvis der ikke findes data for imageId, sættes this.catText til en tom streng
          this.catText = ""; //Sætter catText til en tom streng
        }
      } catch (error) { //Hvis der opstår en fejl ved hentning af tekst, logges fejlen og this.catText sættes til en tom streng
        console.error("Fejl ved hentning af katte-tekst:", error); //Logger fejlen
        this.catText = ""; //Sætter catText til en tom streng
      }
    },
    showNotification(message) {
    // Kun opdater notification, hvis der ikke allerede er en besked
    if (!this.notification) {
      this.notification = message;
    }
  },
  },
  //'Mounted' betyder, at noget er blevet sat op og er klar til brug
  mounted() {
    // Importer lydfilen og opret et Audio-objekt
    this.meowSound = new Audio(require('@/assets/sound/cat-growl-96248.mp3')); //Vi bruger require til at importere lydfilen og opretter et nyt audio objekt
    this.fetchCatText(); //Henter teksten, når komponenten monteres
    this.lastImageId = this.imageId; //Gemmer det sidste imageId, der blev brugt til at hente tekst
  },
  watch: {
    imageId(newVal, oldVal) { //Watcheren lytter efter ændringer i imageId og kalder fetchCatText, når der sker en ændring
      if (newVal !== oldVal) { //Hvis det nye imageId er forskelligt fra det gamle imageId, kaldes fetchCatText
        this.fetchCatText(); //Henter teksten, når imageId ændres
      }
    },
  },

  //'BeforeUnmount' betyder, at noget er ved at blive fjernet eller pakket væk
  beforeUnmount() {
    // Sørger for at stoppe lyden og frigive ressourcer, når komponenten fjernes
    this.meowSound.pause();
    this.meowSound = null;
  },


};
</script>

<!-- scoped sikrer, at style kun anvendes på denne komponent -->
<style scoped>
.cat-container {
 position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.cat-container img {
  max-width: 300px;
  height: auto;
  transition: transform 0.3s;
  
}
</style>