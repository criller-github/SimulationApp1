<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-text-field
          label="Søg efter billednavn"
          v-model="searchImageId"
          append-icon="mdi-magnify"
          @click:append="searchImageIdFunc"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <h4>Billeder</h4>
        <v-list>
          <v-list-item
            v-for="(cattext, index) in cattexts"
            :key="index"
            @click="setActiveCatText(cattext, index)"
            :color="index === currentIndex ? 'primary' : ''"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ cattext.image_id }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-btn color="error" @click="removeAllCatTexts">Fjern alle</v-btn>
      </v-col>

      <v-col cols="12" md="6">
        <div v-if="currentCatText">
          <h4>Detaljer</h4>
          <div>
            <strong>Billednavn:</strong> {{ currentCatText.image_id }}
          </div>
          <div>
            <strong>Tekst:</strong> {{ currentCatText.text }}
          </div>

          <v-btn
            color="warning"
            :to="'/admin/' + currentCatText.id"
          >Rediger</v-btn>
        </div>
        <div v-else>
          <p>Klik på et billede for at se detaljer...</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CatTextDataService from "@/services/CatTextDataService";

export default {
  name: "CatTextList",
  data() {
    return {
      cattexts: [],
      currentCatText: null,
      currentIndex: -1,
      searchImageId: "",
    };
  },
  methods: {
    retrieveCatTexts() {
      CatTextDataService.getAll()
        .then((response) => {
          this.cattexts = response.data;
          console.log("Data hentet:", response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    refreshList() {
      this.retrieveCatTexts();
      this.currentCatText = null;
      this.currentIndex = -1;
    },
    setActiveCatText(cattext, index) {
      this.currentCatText = cattext;
      this.currentIndex = index;
    },
    removeAllCatTexts() {
      CatTextDataService.deleteAll()
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    searchImageIdFunc() {
      CatTextDataService.findByImageId(this.searchImageId)
        .then((response) => {
          this.cattexts = response.data;
          this.currentCatText = null;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.retrieveCatTexts();
  },
};
</script>

<style scoped>

</style>
