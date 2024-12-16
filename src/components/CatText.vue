<!-- backend komponent til at vise og redigere den valgte katte-tekst -->

<template>
    <v-container>
        <!--card'et vises kun, hvis der er en currentCatText-->
        <v-card v-if="currentCatText" class="mt-4">
            <!--card titel-->
            <v-card-title class="mt-4 mb-4">
                <span class="text-h5">REDIGER BILLEDENAVNE OG TEKST</span>
            </v-card-title>

            <!-- Formularens inputfelter -->
            <v-card-text>
                <v-form ref="form">
                    <!-- Inputfelt til billednavn -->
                    <v-text-field
                    label="Billednavn"
                    v-model="currentCatText.image_id"
                    required
                    ></v-text-field>

                    <!-- Inputfelt til tekst -->
                    <v-text-field
                    label="Tekst"
                    v-model="currentCatText.text"
                    required
                    ></v-text-field>
                </v-form>
            </v-card-text>

            <!-- Handlinger til sletning og opdatering -->
            <v-card-actions>
                <v-btn color="error" @click="deleteCatText">Slet</v-btn> <!-- kalder metoden deleteCatText, der sletter posten fra databasen -->
                <v-spacer></v-spacer>
                <v-btn color="green" @click="updateCatText">Opdater</v-btn> <!-- kalder metoden updateCatText, der opdaterer posten i databasen -->
            </v-card-actions>
        </v-card>

        <!-- Hvis currentCatText ikke er tilgængelig, vises teksten "Vælg en CatText..." for at indikere, at der mangler data -->
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
        currentCatText: null, // Holder data for den valgte CatText, som hentes fra backend
        message: "", // Bruges til at vise beskeder, som fx "CatText blev opdateret succesfuldt!"
        };
    },
    methods: {
        // Henter en specifik tekst fra databasen baseret på ID (URL-parametret this.$route.params.id)
        getCatText(id) {
            CatTextDataService.get(id)
                .then((response) => {
                    this.currentCatText = response.data; // Gemmer data i currentCatText
                    console.log(response.data);
                })
                .catch((e) => {
                    console.log(e);
                });
            },

        // Sender opdaterede data til backend via CatTextDataService.update
        updateCatText() {
            CatTextDataService.update(
                this.currentCatText.id, // ID for den tekst, der skal opdateres
                this.currentCatText // Nye data til opdatering
            )
        .then((response) => {
            console.log(response.data);
            this.message = "CatText blev opdateret succesfuldt!"; // Feedback til brugeren
            this.$router.push("/admin/list"); // Sender brugeren tilbage til listen
        })
        .catch((e) => {
            console.log(e);
        });
    },

    // Sletter teksten fra databasen via CatTextDataService.delete
    deleteCatText() {
        CatTextDataService.delete(this.currentCatText.id)
            .then((response) => {
                console.log(response.data);
                this.$router.push("/admin/list"); // Navigerer tilbage til listen
            })
            .catch((e) => {
            console.log(e);
            });
        },
    },

    // Kaldes, når komponenten er blevet monteret på DOM'en og Henter data for den valgte tekst baseret på URL'ens ID
    mounted() {
        this.getCatText(this.$route.params.id); // Bruger ID fra URL'en til at hente den rigtige CatText
    },
};
</script>

<style scoped>
</style>
