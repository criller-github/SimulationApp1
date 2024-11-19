<template>
  <v-container>
    <v-card v-if="currentCatText">
      <v-card-title>
        <span class="text-h5">Rediger CatText</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            label="Billednavn"
            v-model="currentCatText.image_id"
            required
          ></v-text-field>
          <v-text-field
            label="Tekst"
            v-model="currentCatText.text"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="deleteCatText">Slet</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="updateCatText">Opdater</v-btn>
      </v-card-actions>
    </v-card>
    <div v-else>
      <p>Vælg en CatText...</p>
    </div>
  </v-container>
</template>

<script>
import CatTextDataService from "@/services/CatTextDataService";

export default {
  name: "CatText",
  data() {
    return {
      currentCatText: null,
      message: "",
    };
  },
  methods: {
    getCatText(id) {
      CatTextDataService.get(id)
        .then((response) => {
          this.currentCatText = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    updateCatText() {
      CatTextDataService.update(
        this.currentCatText.id,
        this.currentCatText
      )
        .then((response) => {
          console.log(response.data);
          this.message = "CatText blev opdateret succesfuldt!";
          this.$router.push("/admin/list");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    deleteCatText() {
      CatTextDataService.delete(this.currentCatText.id)
        .then((response) => {
          console.log(response.data);
          this.$router.push("/admin/list");
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.getCatText(this.$route.params.id);
  },
};
</script>

<style scoped>

</style>
