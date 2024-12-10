<template>
  <v-container>
    <v-card v-if="currentShopItem">
      <v-card-title>
        <span class="text-h5">REDIGER SHOP ITEM</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-select
            :items="['mad','legetøj','rengøring','medicin']"
            label="Kategori"
            v-model="currentShopItem.category"
            required
          ></v-select>
          <v-text-field label="Titel" v-model="currentShopItem.title" required></v-text-field>
            <v-text-field label="Beskrivelse" v-model="currentShopItem.description" required></v-text-field>
          <v-text-field type="number" label="Pris" v-model="currentShopItem.price" required></v-text-field>
          <v-text-field type="number" label="Hunger Gain" v-model="currentShopItem.hungerGain" required></v-text-field>
        <v-text-field type="number" label="Weight Gain" v-model="currentShopItem.weightGain" required></v-text-field>
        <v-text-field type="number" label="Uses" v-model="currentShopItem.uses" required></v-text-field>

        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="deleteShopItem">Slet</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="green" @click="updateShopItem">Opdater</v-btn>
      </v-card-actions>
    </v-card>
    <div v-else>
      <p>Vælg en vare...</p>
    </div>
  </v-container>
</template>

<script>
import ShopItemDataService from "@/services/ShopItemDataService";

export default {
  name: "ShopItem",
  data() {
    return {
      currentShopItem: null,
      message: ""
    };
  },
  methods: {
    getShopItem(id) {
      ShopItemDataService.get(id)
        .then(response => {
          this.currentShopItem = response.data;
        })
        .catch(e => console.log(e));
    },
    updateShopItem() {
      ShopItemDataService.update(this.currentShopItem.id, this.currentShopItem)
        .then(() => {
          this.message = "Opdateret";
          this.$router.push("/admin/shoplist");
        })
        .catch(e => console.log(e));
    },
    deleteShopItem() {
      ShopItemDataService.delete(this.currentShopItem.id)
        .then(() => {
          this.$router.push("/admin/shoplist");
        })
        .catch(e => console.log(e));
    }
  },
  mounted() {
    this.getShopItem(this.$route.params.id);
  }
};
</script>
