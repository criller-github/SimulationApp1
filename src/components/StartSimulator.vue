<template>
  <div class="simulator">
    <h1>{{ title }}</h1>
    <div class="desc" v-html="description"></div>
      <img :src="require('@/assets/images/VelkommenCat.gif')" alt="Cat" width="200" class="my-icon" />
      <button @click="startSimulator">{{ buttonText }}</button>
  </div>
</template>

<script>

export default {
  name: 'StartSimulator',
  data() {
    return {
      title: "Velkommen til kæledyrssimulatoren!",
      description: `
        I løbet af en uge får du notifikationer om fodring, pleje, leg og tømning af kattebakken.<br>
        - Din kat har i alt ni liv. Hver gang du beder om hjælp, koster det ét liv.<br>
        - Det vil koste dig penge, hver gang katten skal fodres, plejes, eller leges med.<br>
      `,
      buttonText: "Start kæledyr simulator",
    };
  },
  methods: {
    startSimulator() {
      // Navigate til en anden component, vores kat simulator.
       this.$router.push('/simulator-home');
    }
  }
};
</script>





<style scoped>
.simulator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  height: 100vh;
}

h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
    line-height: 1.3;
}

.desc {
  font-size: 1.3rem;
  margin: 0 1rem 1.5rem;
  line-height: 1.5;
}

button {
  background-color: #f28b82;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1.3rem;
  margin-top: 1rem;
}

button:hover {
  background-color: #f0626e;
}

.my-icon {
  margin: 0.1rem;
}
</style>