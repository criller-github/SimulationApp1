<!-- viser kattens billede baseret på dens tilstand -->
<template>


<!--
@drop.prevent="onDrop": 
- Lytter efter drop-begivenheden 
- prevent forhindrer standard browserbehavior for drop-begivenheden (som ellers ville blokere drop)
- Kalder metoden onDrop når noget droppes på elementet (cat-container)

@dragover.prevent:
- Lytter efter dragover-begivenheden 
- prevent tillader drop-begivenheden ved at forhindre standard-behavior, der ellers ville blokere drop-->
  <div
    class="cat-container"
    @drop.prevent="onDrop" 
    @dragover.prevent
  >
  <!-- catImage er en computed property, der bestemmer, hvilket billede der skal vises baseret på kattens status -->
    <img :src="catImage" alt="" />
  </div>
</template>

<script>
export default {
  name: 'CatComponent',
  props: {
    status: Object, // Modtager kattens status fra the parent (Home.vue)
  },
  computed: {
  catImage() {
    // Bestemmer hvilket billede der skal vises baseret på kattens status
    if (this.status.injured) {
      return require('@/assets/images/InjuredCat.gif');
    } else if (this.status.weight >= 100) { // hvis weight er større end 100 vises cat_fat.webp
      return require('@/assets/images/FatCat.gif'); 
    } else if (this.status.hunger <= 30) {
      return require('@/assets/images/HungryCat.gif');
    } else if (this.status.happiness <= 30) {
      return require('@/assets/images/SadCat.gif');
    } else if (this.status.hygiene <= 30) {
      return require('@/assets/images/DirtyCat.gif');
    } else {
      return require('@/assets/images/cat.gif');
    }
  },
  },
  methods: {
    // Håndterer når en handling droppes hen på katten
    onDrop(event) {
      const action = event.dataTransfer.getData('action'); // Henter den data (string), der blev sat under drag-start i ActionButton.vue 
      this.$emit('action-performed', action); // emitter en custom event til parent (Home.vue), så den kan håndtere handlingen
    },
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
}
</style>