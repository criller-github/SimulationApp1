<!-- viser antallet af liv tilbage ved hjælp af hjerteikoner -->
<template>
  <v-row class="life-indicator" justify="center">
    <!-- 
    v-for="n in totalLives"
    - laver et loop fra 1 til totalLives (som er 9)
    - n er iteratoren
    
    :key="n":
    - unik nøgle for hvert ikon i loopet (krævet af Vue)

    :color="n <= lives ? 'red' : 'grey lighten-1'":
    - bestemmer farven på ikonet baseret på, om n er mindre end eller lig med lives
    - hvis n er mindre end eller lig med aktuelle lives, vises ikonet i rød
    - ellers vises ikonet i en lys grå farve-->
    <v-icon
      v-for="n in totalLives"
      :key="n"
      :color="n <= lives ? 'red' : 'grey lighten-1'"
    >
      mdi-heart
    </v-icon>
  </v-row>
</template>

<script>
export default {
  name: 'LifeIndicator',
  props: {
    lives: Number, //modtager antallet af liv fra paretn (Home.vue)
  },
  computed: {
    totalLives() { //Bruges i template til at bestemme, hvor mange hjerteikoner der skal vises
      return 9; //returnerer det totale antal liv, som er 9
    },
  },
};
</script>

<style scoped>
.life-indicator {
  margin-top: 20px;
}
</style>
