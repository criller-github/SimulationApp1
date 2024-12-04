<template>
  <v-dialog v-model="localVisible" persistent @close="closeDialog" max-width="500px">
    <v-card class="dialog-card">

      <v-card-title class="dialog-title">Katten er desværre død</v-card-title>
      <v-img
        :width="300"
        aspect-ratio="16/9"
        cover
        :src="require('@/assets/images/DeadCat.gif')" 
        class="dialog-image"
      ></v-img>

      <v-card-actions>
        <v-btn 
          @click="navigateToAnotherPage" 
          class="try-again-button"
        >
          Ok
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  props: {
    // Indgående prop for at bestemme synlighed af dialogen
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    localVisible: {
      get() {
        return this.isVisible;
      },
      set(value) {
        this.$emit('update:isVisible', value);
      },
    },
  },
  methods: {
    // Lukker dialogen
    closeDialog() {
      this.localVisible = false;
    },
    // Naviger til en anden side
    navigateToAnotherPage() {
      this.closeDialog(); // Luk dialogen
      this.$router.push('/cat-search'); // Naviger til CatSearch.vue
    },
  },
};
</script>



<style scoped>
.dialog-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dialog-close {
  display: flex;
  justify-content: flex-end;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin: 6px 0;
}

.dialog-image {
  margin: 0 auto; 
  border-radius: 8px; 
}

.dialog-text {
  text-align: center;
  font-size: 1rem;
  color: #555;
  margin: 6px;
}

.try-again-button {
    width: 50%;
    background-color: #4CAF50; 
    color: white; 
    font-weight: bold;
    border-radius: 8px;
    margin: 0 auto; 
}

.try-again-button:hover {
  background-color: #45a049; 
}

.try-again-button:disabled {
  background-color: #919191; 
  color: #272727; 
  cursor: not-allowed; 
}

</style>

     