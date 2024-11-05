<!-- knapper til brugerinteraktion (fodre, lege, rense, heale) -->
<template>
<!-- 
fab:
- gør knappen rund

:draggable="true":
- Gør knappen dragbar, så brugeren kan trække den

@dragstart="dragStart":
- Binder dragstart-begivenheden til metoden dragStart-->
  <v-btn
    class="action-button"
    fab
    :draggable="true"
    @dragstart="dragStart"
  >
  <!-- 
  <v-icon>{{ icon }}</v-icon>:
  - Viser det ikon, der er angivet via icon prop. 
  
  {{ icon }}:
  - Interpolation af icon prop, der indeholder navnet på ikonet (f.eks. 'mdi-food').-->
    <v-icon class="icon">{{ icon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    icon: String, // modtager ikonnavnet fra forælderen (Home.vue) så det rigtige ikon vises
  },
  methods: {
    dragStart(event) {
    // Når brugeren begynder at trække knappen
      event.dataTransfer.setData('action', this.icon);
      // Gemmer icon værdien i dataTransfer objektet under nøgleordet 'action'.
      // gør det muligt at overføre information om hvilken handling, der udføres, når knappen droppes et andet sted (på katten)
    },
  },
};
</script>

<style scoped>
.action-button {
  width: 60px;
  height: 60px;
  margin: 10px;
  

   
}
.icon{
  font-size: 50px;
  
}

</style>
