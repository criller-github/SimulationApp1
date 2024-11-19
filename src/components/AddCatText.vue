<template>
  <v-container>
    <v-card v-if="!submitted">
      <v-card-title>
        <span class="text-h5">Tilføj Ny CatText</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            label="Billednavn"
            v-model="cattext.image_id"
            required
          ></v-text-field>
          <v-text-field
            label="Tekst"
            v-model="cattext.text"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="saveCatText">Gem</v-btn>
      </v-card-actions>
    </v-card>
    <div v-else>
      <h4>Du har indsendt succesfuldt!</h4>
      <v-btn color="success" @click="newCatText">Tilføj mere</v-btn>
    </div>
  </v-container>
</template>

<script>
import CatTextDataService from "@/services/CatTextDataService";

export default {
  name: "AddCatText",
  data() {
    return {
      cattext: {
        id: null,
        image_id: "",
        text: "",
      },
      submitted: false,
    };
  },
  methods: {
    saveCatText() {
      var data = {
        image_id: this.cattext.image_id,
        text: this.cattext.text,
      };

      CatTextDataService.create(data)
        .then((response) => {
          this.cattext.id = response.data.id;
          console.log(response.data);
          this.submitted = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    newCatText() {
      this.submitted = false;
      this.cattext = {
        id: null,
        image_id: "",
        text: "",
      };
    },
  },
};
</script>

<style scoped>

</style>
