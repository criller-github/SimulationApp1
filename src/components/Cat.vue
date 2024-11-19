<!-- viser kattens billede baseret på dens tilstand -->
<template>


<!--
@drop.prevent="onDrop": 
- Lytter efter drop-begivenheden 
- prevent forhindrer standard browserbehavior for drop-begivenheden (som ellers ville blokere drop)
- Kalder metoden onDrop når noget droppes på elementet (cat-container)

@dragover.prevent:
- Lytter efter dragover-begivenheden 
- prevent tillader drop-begivenheden ved at forhindre standard-behavior, der ellers ville blokere drop
- playMeow lytter efter til om der er blevet klikket inde i kattens område-->
  <div
    class="cat-container"
    @drop.prevent="onDrop" 
    @dragover.prevent
    @click="playMeow"
  >


  <!-- catImage er en computed property, der bestemmer, hvilket billede der skal vises baseret på kattens status -->
  <!-- Brug catSize til at bestemme billedets størrelse -->
    <img :src="catImage" :style="{ transform: 'scale(' + catSize + ')' }" alt="" />
    <!-- <p>{{ catText }}</p> Viser den hentede tekst under kattens billede -->
  </div>
  
</template>

<script>
import CatTextDataService from "@/services/CatTextDataService";

export default {
  name: 'CatComponent',
  props: {
    status: Object, // Modtager kattens status fra the parent (Home.vue)
    catSize: { // Modtager kattens størrelse som prop fra forælderen
        type: Number,
        default: 1, // Standard størrelse
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
    // Bestemmer hvilket billede der skal vises baseret på kattens status
    if (this.status.injured) {
      return require('@/assets/images/InjuredCatT.gif');
    } else if (this.status.weight >= 100) { // hvis weight er større end 100 vises cat_fat.webp
      return require('@/assets/images/FatCatT.gif'); 
    } else if (this.status.hunger <= 30) {
      return require('@/assets/images/HungryCatT.gif');
    } else if (this.status.happiness <= 30) {
      return require('@/assets/images/SadCatT.gif');
    } else if (this.status.hygiene <= 30) {
      return require('@/assets/images/DirtyCatT.gif');
    } else {
      return require('@/assets/images/CatT.gif');
    }
  },
   imageId() {
      //Beregner et imageId baseret på kattens tilstand, som vi bruger til at hente den korrekte tekst fra backenden
      if (this.status.injured) {
        return 'injured_cat';
      } else if (this.status.weight >= 100) {
        return 'fat_cat';
      } else if (this.status.hunger <= 30) {
        return 'hungry_cat';
      } else if (this.status.happiness <= 30) {
        return 'sad_cat';
      } else if (this.status.hygiene <= 30) {
        return 'dirty_cat';
      } else {
        return 'happy_cat';
      }
    },
  },
  methods: {
    // Håndterer når en handling droppes hen på katten
    onDrop(event) {
      const action = event.dataTransfer.getData('action'); // Henter den data (string), der blev sat under drag-start i ActionButton.vue 
      this.$emit('action-performed', action); // emitter en custom event til parent (Home.vue), så den kan håndtere handlingen
    },
    playMeow() {
          // Nulstil lyden, hvis den allerede afspilles (for at undgå overlap hvis brugeren klikker flere gange hurtigt)
      this.meowSound.play();
    },
     async fetchCatText() {
      try {
        const response = await CatTextDataService.findByImageId(this.imageId);
        if (response.data.length > 0) {
          this.catText = response.data[0].text;
          this.$emit("show-notification", this.catText);
        } else {
          this.catText = "";
        }
      } catch (error) {
        console.error("Fejl ved hentning af katte-tekst:", error);
        this.catText = "";
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
    imageId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchCatText();
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