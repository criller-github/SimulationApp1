<template>
  <div class="simulator">
    <h1>{{ title }}</h1>
    <div class="desc" v-html="description"></div>
      <img :src="require('@/assets/images/CatVelkommenT.gif')" alt="Cat" width="200" class="my-icon" />
      <button @click="startSimulator">{{ buttonText }}</button>
  </div>
</template>

<script>

export default {
  name: 'StartSimulator',
  data() {
    return {
      title: '',
      description: '',
      buttonText: '',
    };
  },
  methods: {
    startSimulator() {
      // Navigate til en anden component, vores kat simulator.
       this.$router.push('/simulator-home');
    }
  },
  mounted() {
  // Tjek om spillet er igang via localStorage
  const catDay = localStorage.getItem('catDay');
  const currentProblem = localStorage.getItem('currentProblem');
  const lives = localStorage.getItem('lives') ? parseInt(localStorage.getItem('lives'),10) : 9;
  
  let inProgress = false;
  if ((catDay && parseInt(catDay,10) > 1) ||
      (currentProblem && currentProblem !== 'null' && currentProblem !== 'undefined') ||
      (lives < 9)) {
    inProgress = true;
  }

  // Hvis spillet er igang
  if (inProgress) {
      // Hvis spillet allerede er i gang
      this.buttonText = "Fortsæt hvor du slap";
      this.title = "Velkommen tilbage!";
      this.description = `Husk, at...<br>- I løbet af 7 dage får du ansvaret for en virtuel kat!<br> 
        - Du skal tage højde for kattens kropsprog som viser dens nuværende behov.<br>
        - En kat kan sagtens have flere behov på samme tid, men du kan kun se ét ad gangen.<br>
        - Katten har i alt 9 liv som går ned hver gang ét af kattens behov ikke bliver mødt.<br>
        - Du har mulighed for at spørge om hjælp, dog koster det ét liv hver gang.<br>
        - Hvis kattens skal fodres, har du mulighed for at købe forskellige variatoner af mad i shoppen.<br>
        - Undervejs vil du modtage virtuelle penge som du kan enten kan bruge på shoppen eller medicin. `;
    } else {
      // Ingen igangværende status, behold standard tekster
      this.buttonText = "Start kæledyr simulator";
      this.title = "Velkommen til din personlige kæledyrs-simulator!";
      this.description = `
        - I løbet af 7 dage får du ansvaret for en virtuel kat!<br>
        - Du skal tage højde for kattens kropsprog som viser dens nuværende behov.<br>
        - En kat kan sagtens have flere behov på samme tid, men du kan kun se ét ad gangen.<br>
        - Katten har i alt 9 liv som går ned hver gang ét af kattens behov ikke bliver mødt.<br>
        - Du har mulighed for at spørge om hjælp, dog koster det ét liv hver gang.<br>
        - Hvis kattens skal fodres, har du mulighed for at købe forskellige variatoner af mad i shoppen.<br>
        - Undervejs vil du modtage virtuelle penge som du kan enten kan bruge på shoppen eller medicin.
      `;
    }
},
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