<template>
  <v-container>
    <v-row align="center" class="mt-4 mb-0 pb-0">
      <v-col cols="12" md="4">
        <h2 class="mb-2">Shop Varer</h2>
      </v-col>
      <v-col cols="12" md="8">
        <v-select
          :items="['','mad','legetøj','rengøring','medicin']"
          label="Filter efter kategori"
          v-model="searchCategory"
          @change="retrieveShopItems"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-expansion-panels v-model="currentIndex" accordion>
          <v-expansion-panel
            v-for="(item, index) in shopitems"
            :key="item.id"
            :value="index"
          >
            <v-expansion-panel-title>
              <span class="headline">{{ item.title }} ({{ item.category }})</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row align="center">
                <v-col cols="4">
                  <strong>Titel:</strong> {{ item.title }}
                </v-col>
                <v-col cols="4">
  <strong>Beskrivelse:</strong> {{ item.description }}
</v-col>
<v-col cols="2">
  <strong>Pris:</strong> {{ item.price }}
</v-col>
<v-col cols="3">
  <strong>Hunger Gain:</strong> {{ item.hungerGain }}
</v-col>
<v-col cols="3">
  <strong>Weight Gain:</strong> {{ item.weightGain }}
</v-col>
<v-col cols="3">
  <strong>Uses:</strong> {{ item.uses }}
</v-col>


                <v-col cols="2">
                  <v-btn
                    color="green"
                    :to="'/admin/shop/'+ item.id"
                    class="mt-2"
                  >
                  Rediger
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import ShopItemDataService from '@/services/ShopItemDataService';

export default {
  name: 'ShopItemList',
  setup() {
    const shopitems = ref([]);
    const currentIndex = ref(null);
    const searchCategory = ref(null);

    const retrieveShopItems = () => {
      ShopItemDataService.getAll(searchCategory.value)
        .then(response => {
          shopitems.value = response.data;
          currentIndex.value = null;
        })
        .catch(e => console.log(e));
    };

    onMounted(() => {
      retrieveShopItems();
    });

    return {
      shopitems,
      currentIndex,
      searchCategory,
      retrieveShopItems
    };
  }
};
</script>
