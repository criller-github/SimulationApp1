<!-- Katalog for at købe mad -->
<template>
  <!-- Dialog til at vise kataloget -->
  <v-dialog name="boks" class="boks" :model-value="visible" @update:model-value="$emit('update:visible', $event)" persistent>
    <!-- card til at vise kataloget -->
    <v-card name="card">
      <v-card-title class="d-flex justify-space-between">
        Katte Katalog
        <v-btn icon @click="$emit('update:visible', false)">
          <svg-icon type="mdi" :path="path"></svg-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div v-if="!selectedCategory">
          <!-- Vis kategorier -->
          <v-btn @click="selectCategory('mad')">
            <svg-icon type="mdi" :path="path2" class="mr-2"></svg-icon> Mad
          </v-btn>
          <!--
          <v-btn @click="selectCategory('legetøj')">Legetøj</v-btn>
          <v-btn @click="selectCategory('rengøring')">Rengøring</v-btn>
          <v-btn @click="selectCategory('medicin')">Medicin</v-btn>
          -->
        </div>
        <div v-else>
          <!-- Vis items i kategorien -->
          <v-btn @click="selectedCategory = null" style="margin: 0 0 10px;">Tilbage</v-btn>
          
          <v-list >
            <v-list-item class="card"
              v-for="item in shopItems"
              :key="item.id"
            >
                <v-list-item-title class="font-weight-bold">{{ item.title }}</v-list-item-title>
                <v-list-item-description>{{ item.description }}</v-list-item-description>

                 <div>
                    <svg-icon type="mdi" :path="path2" ></svg-icon>
                    Sultnedsættelse: {{ item.hungerGain }}
                </div>
                <div>
                    <svg-icon type="mdi" :path="path4"></svg-icon>
                    Vægtøgning: {{ item.weightGain }}
                </div>
                <div>
                    <svg-icon type="mdi" :path="path5"></svg-icon>
                    Anvendelser: {{ item.uses }}
                </div>

              {{ item.price }} kr <v-btn color="green" @click="buyItem(item)">Køb</v-btn>
            </v-list-item>
          </v-list>

        </div>
      </v-card-text>
      
    </v-card>
  </v-dialog>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon'; // Importer vue-icon
import { mdiClose, mdiFood, mdiWeightGram , mdiRepeat } from '@mdi/js'; // Importer mdiClose, mdiFood, mdiWeightGram og mdiRepeat
import ShopItemDataService from '@/services/ShopItemDataService'; // Importer ShopItemDataService

export default {
  props: {
    // Props til at vise dialogen
    visible: Boolean, // Prop til at vise penge
    money: Number,
    },

  components: {
    SvgIcon // Komponent til at vise ikoner
  },

  data() {
    return {
      selectedCategory: null,
      shopItems: [],
      path: mdiClose,
      path2: mdiFood,
      path4: mdiWeightGram,
      path5: mdiRepeat,
      
    };
  },
  methods: {
    // @vuese
    // Vælg kategori af items
    // @arg parameteret cat er kategorien, der skal vælges
    selectCategory(cat) {
      this.selectedCategory = cat;
      // Hent items fra backend
      ShopItemDataService.getAll(cat) // Henter alle items fra backend
        .then(response => {
          this.shopItems = response.data;
        })
        .catch(e => console.log(e));
    },
    // @vuese
    // køb item og send det tilbage til parent
    // @arg parameteret item er det item, der skal købes
    buyItem(item) { 
      // Metode til at købe item fra kataloget
      // @arg parameteret item er det item, der skal købes
        this.$emit('item-purchased', item);
    }
  }
};
</script>

<style scoped>
.card {
  margin: 0 30px 30px 0;
  border: solid 1px #e0e0e0;
  border-radius: 60px;
  padding: 10px;
  box-shadow: 0 1px 5px 1px #a3a2a2;
}

.boks {
  position: absolute !important;
  max-width: 500px;
  max-height: 700px;
}

</style>