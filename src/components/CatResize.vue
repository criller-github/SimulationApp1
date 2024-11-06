<template>

<v-speed-dial
  location="bottom center"
  transition="fade-transition"
>
  <template v-slot:activator="{ props: activatorProps }">
    <button v-bind="activatorProps">
        <svg-icon class="gear" type="mdi" :path="path"></svg-icon>
    </button>
  </template>

    <p key="1">Kattestørrelse:</p>
    <v-btn @click="selectSize(0.5)" key="2">Lille</v-btn>
    <v-btn @click="selectSize(1)" key="3">Mellem</v-btn>
    <v-btn @click="selectSize(1.45)" key="4">Stor</v-btn>
  
</v-speed-dial>


</template>




<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCog } from '@mdi/js';

export default {
  data() {
    return {
      catSize: 1, // Standardstørrelsen for kattens billede
      path: mdiCog,
    };
  },
  components: {
    SvgIcon
  },

  methods: {
    
    selectSize(size) {
      this.catSize = size; // Ændrer kattens billedstørrelse
      this.showPopup = false; // Luk popup efter valg
      this.$emit('size-changed', this.catSize); // Sender størrelsen tilbage til parent-komponenten
    },
  },
};
</script>

<style scoped>

.gear{
    font-size: 24px;
    color: #ffffff;
    background-color: #9E9E9E;
    width: 60px; 
    height: 60px; 
    border-radius: 50%; 
    text-align: center;
    padding: 15px;
}

</style>
