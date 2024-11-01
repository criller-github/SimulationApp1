<template>
  <v-app>
    <v-main>
      <!--  
        <HelloWorld/>
      -->
      <StartSimulator/>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import StartSimulator from './components/StartSimulator.vue'


export default {
  name: 'App',

  components: {
    //HelloWorld, 
    StartSimulator,
  },

  data: () => ({
    //
  }),
}
</script>
