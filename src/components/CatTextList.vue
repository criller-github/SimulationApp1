<!--fungerer som en listevisning for alle kattebilleder og deres tilknyttede tekster i admin-panelet-->

<template>
  <v-container>
    <!-- Første række med overskrift og søgefelt -->
    <v-row align="center" class="mt-4 mb-0 pb-0">
      <!-- Venstre 2/3 med overskrift -->
      <v-col cols="12" md="4" class="mb-0 pb-0">
        <h2 class="mb-2">BILLEDENAVNE:</h2>
      </v-col>
      <!-- Højre 1/3 med søgefelt -->
      <v-col cols="12" md="8" class="mb-0 pb-0">
        <!-- v-text-field er en Vuetify-komponent, der fungerer som et inputfelt -->
        <!-- label="Søg efter billednavn" tilføjer en label til inputfeltet -->
        <!-- v-model="searchImageId" binder inputfeltet til en variabel i data() -->
        <!-- @keyup.enter="searchImageIdFunc" tilføjer en event, der kalder søgefunktionen, når brugeren trykker "Enter" -->
        <v-text-field 
          label="Søg efter billednavn"
          v-model="searchImageId"
          @keyup.enter="searchImageIdFunc" 
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Anden række med listen som expansion panels -->
    <v-row class="mb-0 pb-0 pt-0 mt-0">
      <!-- Listen over billednavne (fuld bredde) -->
      <v-col cols="12" class="mb-0 pb-0 pt-0 mt-0">

        <!-- v-expansion-panel bruges til at lave en "accordion"-lignende liste, hvor hver panel kan åbnes/lukkes -->
        <!-- v-model="currentIndex" binder det aktuelle panel, der er åbnet, til den reaktive variabel currentIndex og accordion gør så kun 1 kan være åben-->
        <v-expansion-panels v-model="currentIndex" accordion>

            <!-- v-expansion-panel-title er titlen på hvert panel -->
            <!-- v-for="cattext in cattexts" bruges til at loope igennem alle cattexts og genererer en panel-post for hver cattext -->
            <!-- :key="cattext.id" binder en unik key til hvert panel -->
            <!-- :value="index" binder index til værdien af det aktuelle panel -->
          <v-expansion-panel
            v-for="(cattext, index) in cattexts"
            :key="cattext.id"
            :value="index"
          >

            <!-- v-expansion-panel-title er titlen på hvert panel -->
            <!-- {{ cattext.image_id }} er dynamisk data-binding for at vise image.id som overskriften -->
            <v-expansion-panel-title>
              <span class="headline">{{ cattext.image_id }}</span>
            </v-expansion-panel-title>

            <!-- v-expansion-panel-text er teksten i hvert panel -->
            <v-expansion-panel-text>
                <v-row align="center">
                    <v-col cols="4">
                        <div>
                            <!-- dynamisk data-binding for at vise billedenavn -->
                            <strong>Billednavn:</strong> {{ cattext.image_id }}
                        </div>
                    </v-col>
                    <v-col cols="4">
                        <!-- dynamisk data-binding for at vise tekst -->
                            <strong>Tekst:</strong> {{ cattext.text }}
                    </v-col>
                    <v-col cols="4">
                        <!-- sender brugeren til redigeringspanelet for det valgte cattext.id -->
                        <v-btn
                        color="green"
                        :to="'/admin/' + cattext.id" 
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
//bruger ref til at deklarere reaktive variabler til brug af Composition API
//bruger onMounted til at udføre kode, når komponenten er indlæst
import { ref, onMounted } from 'vue';
//CatTextDataService er en service til at kommunikere med backend
import CatTextDataService from '@/services/CatTextDataService';

export default {
  name: 'CatTextList',
  setup() {
    //ref() bruges til at deklarere en reaktiv variabel til brug af Composition API 
    const cattexts = ref([]); //indeholder listen over data og Gemmer data hentet fra backend
    const currentIndex = ref(null); //Holder styr på det aktuelt åbne panel og gemmer, hvilket panel der aktuelt er åbent
    const searchImageId = ref(''); // binder til inputfeltet for søgning og gemmer værdien af inputfeltet/søgeordet

    
    //retrieveCatTexts henter alle cattexts fra backend og gemmer dem i cattexts
    const retrieveCatTexts = () => {
      CatTextDataService.getAll()
        .then((response) => {
          cattexts.value = response.data;
          console.log('Data hentet:', cattexts.value);
        })
        .catch((e) => {
          console.error('Fejl ved hentning af data:', e);
        });
    };

    //searchImageIdFunc henter data for et specifikt billednavn baseret på søgefeltets værdi
    const searchImageIdFunc = () => {
      CatTextDataService.findByImageId(searchImageId.value)
        .then((response) => {
          cattexts.value = response.data;
          currentIndex.value = null;
          console.log('Søgeresultater:', cattexts.value);
        })
        .catch((e) => {
          console.error('Fejl ved søgning:', e);
        });
    };

    //onMounted bruges til at udføre kode, når komponenten er indlæst, den kalder altså retrieveCatTexts, når komponenten er klar
    onMounted(() => {
      retrieveCatTexts();
    });

    //returnerer variabler og funktioner, som kan bruges i template
    return {
      cattexts,
      currentIndex,
      searchImageId,
      searchImageIdFunc,
    };
  },
};
</script>

<style scoped>
.headline {
  font-size: 18px;
  font-weight: 500;
}
</style>
