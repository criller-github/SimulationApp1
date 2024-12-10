<template>
  <v-container>
    <v-card v-if="!submitted">
      <v-card-title>
        <span class="text-h5">Tilføj Ny Shop Vare</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-select
            :items="['mad','legetøj','rengøring','medicin']"
            label="Kategori"
            v-model="shopitem.category"
            required
          ></v-select>
          <v-text-field label="Titel" v-model="shopitem.title" required></v-text-field>
            <v-text-field label="Beskrivelse" v-model="shopitem.description" required></v-text-field>
          <v-text-field type="number" label="Pris" v-model="shopitem.price" required></v-text-field>
          <v-text-field type="number" label="Hunger Gain" v-model="shopitem.hungerGain" required></v-text-field>
        <v-text-field type="number" label="Weight Gain" v-model="shopitem.weightGain" required></v-text-field>
        <v-text-field type="number" label="Uses" v-model="shopitem.uses" required></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="green" @click="saveShopItem">Gem</v-btn>
      </v-card-actions>
    </v-card>

    <div v-else>
      <h4>Vare tilføjet</h4>
      <v-btn color="green" @click="newShopItem">Tilføj mere</v-btn>
    </div>
  </v-container>
</template>

<script>
import ShopItemDataService from "@/services/ShopItemDataService";

export default {
  name: "AddShopItem",
  data() {
    return {
      shopitem: {
        title: "",
        category: "",
        description: "",
        price: null,
        hungerGain: null,
        weightGain: null,
        uses: null
      },
      submitted: false
    };
  },
  methods: {
    saveShopItem() {
      const data = {
        title: this.shopitem.title,
        category: this.shopitem.category,
        price: Number(this.shopitem.price),
        description: this.shopitem.description,
        hungerGain: Number(this.shopitem.hungerGain),
        weightGain: Number(this.shopitem.weightGain),
        uses: Number(this.shopitem.uses),
    };

      ShopItemDataService.create(data)
        .then((response) => {
          console.log(response.data);
          this.submitted = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    newShopItem() {
      this.submitted = false;
      this.shopitem = {
        title: "",
        category: "",
        price: null,
        description: "",
        hungerGain: null,
        weightGain: null,
        uses: null
      };
    }
  }
};
</script>