<!-- giver brugeren mulighed for at tilføje en ny katte-tekst til databasen via frontend -->

<template>
    <v-container>
        <!-- v-card til at vise formularen -->
        <v-card v-if="!submitted"> <!-- sikrer, at vcard'et kun vises, når brugeren endnu ikke har indsendt data -->
            <!-- v-card-title til at vise overskriften -->
            <v-card-title>
                <span class="text-h5">Tilføj Ny Katte tekst</span>
            </v-card-title>
            
            <!-- Formularens inputfelter -->
            <v-card-text>
                <v-form ref="form">
                    <!-- Inputfelt til billednavn -->
                    <v-text-field
                    label="Billednavn"
                    v-model="cattext.image_id"
                    required
                    ></v-text-field>

                    <!-- Inputfelt til tekst -->
                    <v-text-field
                    label="Tekst"
                    v-model="cattext.text"
                    required
                    ></v-text-field>
                </v-form>
            </v-card-text>

            <!-- Handlinger for at gemme data -->
            <v-card-actions>
                <v-btn color="green" @click="saveCatText">Gem</v-btn>
            </v-card-actions>
        </v-card>

        <!-- Feedback efter indsendelse -->
        <div v-else>
            <h4>Billedeteks tilføjet</h4>
            <v-btn color="green" @click="newCatText">Tilføj mere</v-btn>
        </div>
    </v-container>
</template>


<script>
import CatTextDataService from "@/services/CatTextDataService";

export default {
    name: "AddCatText", // Navnet på komponenten
    data() {
        return {
            //objekt til at gemme brugerens input (id, image_id og text)
            cattext: {
            id: null, // ID opdateres, når backend svarer
            image_id: "", // Brugerens input til billednavnet
            text: "", // Brugerens input til teksten
            },
        submitted: false, // n boolean, der bestemmer, om succes-feedback vises til brugeren
        };
    },
    methods: {
        // Metode til at gemme en ny katte-tekst i databasen
        // Opretter et dataobjekt baseret på brugens input og sender det til backend via CatTextDataService.create
        saveCatText() {
        var data = {
            image_id: this.cattext.image_id,
            text: this.cattext.text,
        };
        // Hvis anmodningen lykkes, opdateres cattext.id, og submitted sættes til true
        // Sender data til backend via CatTextDataService
        CatTextDataService.create(data)
            .then((response) => {
            // Opdaterer komponentens data, når backend svarer succesfuldt
            this.cattext.id = response.data.id;
            console.log(response.data);
            this.submitted = true; // Viser feedback til brugeren
            })
            .catch((e) => {
            console.log(e);
            });
        },
        // Nulstiller dataene i cattext og skifter visningen tilbage til formularen
        newCatText() {
        this.submitted = false; // Skifter tilbage til formular-visning
        this.cattext = {
            id: null, // Nulstiller ID
            image_id: "", // Nulstiller billednavn
            text: "", // Nulstiller tekst
        };
        },
    },
};
</script>

<style scoped>
</style>
