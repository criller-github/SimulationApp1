<template>
  <v-dialog :model-value="visible" @update:model-value="$emit('update:visible', $event)" persistent>
    <v-card>
      <v-card-title>Katte Katalog</v-card-title>
      <v-card-text>
        <div v-if="!selectedCategory">
          <!-- Vis kategorier -->
          <v-btn @click="selectCategory('mad')">Mad</v-btn>
          <!--
          <v-btn @click="selectCategory('legetøj')">Legetøj</v-btn>
          <v-btn @click="selectCategory('rengøring')">Rengøring</v-btn>
          <v-btn @click="selectCategory('medicin')">Medicin</v-btn>
          -->
        </div>
        <div v-else>
          <!-- Vis items i kategorien -->
          <v-btn @click="selectedCategory = null">Tilbage</v-btn>
          <v-list>
            <v-list-item
              v-for="item in shopItems"
              :key="item.id"
            >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-description>{{ item.description }}</v-list-item-description>
                <div>Sultnedsættelse: {{ item.hungerGain }}</div>
                <div>Vægtøgning: {{ item.weightGain }}</div>
                <div>Anvendelser: {{ item.uses }}</div>

              {{ item.price }} kr <v-btn color="green" @click="buyItem(item)">Køb</v-btn>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="$emit('update:visible', false)">Luk</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ShopItemDataService from '@/services/ShopItemDataService';

export default {
  props: {
  visible: Boolean,
  money: Number
    },
  data() {
    return {
      selectedCategory: null,
      shopItems: []
    };
  },
  methods: {
    selectCategory(cat) {
      this.selectedCategory = cat;
      // Hent items fra backend
      ShopItemDataService.getAll(cat)
        .then(response => {
          this.shopItems = response.data;
        })
        .catch(e => console.log(e));
    },
    // Ved køb
    buyItem(item) {
        this.$emit('item-purchased', item);
    }
  }
};
</script>
