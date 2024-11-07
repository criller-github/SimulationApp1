<!-- indeholder hovedlogikken og styrer spillets tilstand -->
<template>
  <v-app> <!-- v-app er en container til vores app og findes i vue biblotekket -->
    <v-container fluid class="HomeContainer"> <!--fluid attributten gør, at containeren strækker sig over hele bredden af skærmen-->
      
      
      
      <!-- Spørgsmålstegn 
      - v-btn er en knap fra vuetify biblotekket. 
      - icon attributten gør, at knappen bliver rund. 
      - @click er en eventlistener, der lytter efter klik på knappen og udfører handleHelp metoden. 
      - class attributten tilføjer en klasse til knappen og kan styles via css -->
      <v-btn
        icon
        @click="handleHelp"
        class="help-button"
        color="grey darken-3"
      >
      <!-- viser ikonet fra Material Design Icons (MDI)-->
        <svg-icon type="mdi" :path="mdiHelp" :width="25" :height="25" color="white"></svg-icon>
      </v-btn>




      <!-- Visning af penge -->      
      <v-btn
        icon
        class="money-display"
        color="green-lighten-1"
          @click="toggleMoneyTooltip"
      >{{ money }}
      <svg-icon type="mdi" :path="mdiCurrencyUsd"></svg-icon>
      <v-tooltip
        content-class="custom-tooltip"

        activator="parent"
        location="bottom"
        v-model="showMoneyTooltip"
        :open-on-hover="false"
        :open-on-focus="false">
        Her er dine penge 
        <br><br>
        tip: Du tjener 5 penge hvert 5. sekund
      </v-tooltip>
      </v-btn>



      <!-- Livsindikator -->
      <!-- LifeIndicator er et komponent, der viser antallet af liv tilbage-->
      <LifeIndicator :lives="lives" />


      <!-- dagsnummer -->
      <v-progress-linear model-value="14" :height="50" color="green" rounded class="progressBar">
      <p class="dayNR"> DAG {{ day }} / 7</p>
      </v-progress-linear>

      



      <v-bth class="gear-icon">
      <!-- Indsætter CatResize komponenten og videregiver catSize -->
      <CatResize @size-changed="updateCatSize" />
      </v-bth>
      <!-- Katten -->
        <!-- CatComponent er et komponent, der viser kattens billede baseret på dens status
        - :status="catStatus": Sender hele catStatus objektet som prop til komponenten
        - @need-update="handleNeedUpdate": Lytter efter en event fra CatComponent, hvis der er behov for at opdatere noget i forælderen
        - @action-performed="handleActionPerformed": Håndterer handlinger udført via drag-and-drop på katten -->
      <CatComponent
        :status="catStatus"
        :catSize="catSize" 
        @need-update="handleNeedUpdate"
        @action-performed="handleActionPerformed"
      />
      <!-- Sender catSize som prop til CatComponent -->

      <div v-if="showDragDrop" class="drag-drop">
        <DragDrop />
      </div>



      <!-- Handlingsknapper 
      - <v-row justify="center">: Wrapper til knapperne, centrerer indholdet horisontalt.
      - <ActionButtonComponent>: En genanvendelig komponent for hver handling (fodre, lege, rense, heale)
      - icon prop: Angiver hvilket ikon der skal vises på knappen
      - @action="handleFeed": Binder den relevante metode til handlingen, når knappen aktiveres-->
      <v-row justify="center" class="icon-Button">
        <ActionButtonComponent
          icon="mdi-food"
          label="Fodre" 
          @action="handleFeed"
        />
        <ActionButtonComponent
          icon="mdi-tennis-ball"
          label="Leg"
          @action="handlePlay"
        />
        <ActionButtonComponent
          icon="mdi-emoticon-poop"
          label="Rengør"
        @action="handleClean"
        />
        <ActionButtonComponent
          icon="mdi-medical-bag"
          label="Heal"
          @action="handleHeal"
        />
      </v-row>

      <!-- Notifikation 
      - viser en notifikation, hvis der er en besked i notification dataen.
      - v-if="notification": Render kun komponenten, hvis notification ikke er en tom streng.
      - :message="notification": Sender beskeden som prop til watcheren i Nptifcation-->
      <NotificationComponent 
      v-if="notification" 
      :message="notification" />


       <!-- Indsætter StartAgain komponenten 
       tilhøre StartAgain.vue
       -->
       <StartAgain 
        :isVisible="showStartAgain" 
        @update:isVisible="showStartAgain = $event" 
        @restart-game="resetGame" 
      />


    </v-container>
  </v-app>
</template>





<script>
// har ændret import CatComponent from '../../components/Cat.vue'; til import CatComponent from '@/components/Cat.vue';
import CatResize from '@/components/CatResize.vue';
import CatComponent from '@/components/Cat.vue';
import LifeIndicator from '@/components/LifeIndicator.vue';
import ActionButtonComponent from '@/components/ActionButton.vue';
import NotificationComponent from '@/components/Notification.vue';
import StartAgain from '@/components/StartAgain.vue'; //tilhøre StartAgain.vue
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCurrencyUsd, mdiHelp, } from '@mdi/js';
import DragDrop from '@/components/DragDrop.vue'

export default {
  name: 'HomeView',
  components: {
    DragDrop,
    CatResize,
    CatComponent,
    LifeIndicator,
    ActionButtonComponent,
    NotificationComponent,
    StartAgain, //tilhøre StartAgain.vue
    SvgIcon,
  },
  data() {
    return {
      day: 1, // Tracker dage
      lives: 9, // antal liv katten starter med
      money: 50, // startsantallet af penge
      mdiCurrencyUsd, mdiHelp,
      showMoneyTooltip: false, // Viser penge-tooltip
      catStatus: {
      hunger: 100, // kattens sult-niveau
      happiness: 100, // kattens lykke-niveau
      hygiene: 100, // kattens hygiejne-niveau
      injured: false, // om katten er skadet
      weight: 50, // Startvægt
      },
      catSize: 1, // Standardstørrelse

      notification: '', // besked, der vises til brugeren

      showStartAgain: false, // Ny property til at styre popup'en. tilhøre StartAgain.vue

      showDragDrop: true, // Viser drag-and-drop komponenten
    };
  },
  computed: {
    //En beregnet property, der returnerer true, hvis kattens vægt er større eller lig med 100
    isOverweight() {
      return this.catStatus.weight >= 100;
    },
  },
  methods: {
    //metode der viser penge-tooltip
    toggleMoneyTooltip() {
      this.showMoneyTooltip = true;
      setTimeout(() => {
        this.showMoneyTooltip = false;
      }, 2000);

    },
    
    updateCatSize(size) {
      this.catSize = size; // Opdaterer størrelsen af katten
    },

    // Håndterer fodringshandlingen, opdaterer kattens sult, vægt, liv og brugerens penge
    handleFeed() {
      const foodCost = 10; //penge det koster at fodre katten hver gang
      if (this.money >= foodCost) { //en if-statement som tjekker om der er nok penge til at fodre katten
        this.money -= foodCost; //trækker penge fra brugerens pengebeholdning svarende til madprisen
        this.catStatus.hunger = 100; //sætter kattens sult-niveau til 100
        if (this.lives < 9) { //en if-statement som tjekker om katten har mistet et liv
          this.lives++; //hvis katten har mistet et liv, får den et liv tilbage
        }
        // Øg vægten
        this.catStatus.weight += 5; //øger kattens vægt med 5
        // Begræns vægten til maks 150
        if (this.catStatus.weight > 150) { //en if-statement som tjekker om kattens vægt er over 150
          this.catStatus.weight = 150; //sætter kattens vægt til 150 som en maksimal vægtbegrænselse
        }
        this.notification = 'Du har fodret katten! Et liv er genoprettet.'; //besked der vises hvis brugeren har fodret katten
      } else {
        this.notification = 'Du har ikke nok penge til at fodre katten!'; //besked der vises hvis brugeren ikke har nok penge til at fodre katten
      }
    },
    // Håndterer leg med katten, opdaterer lykke og reducerer vægt, hvis nødvendigt
    handlePlay() { //metode der kaldes når brugeren leger med katten
      this.catStatus.happiness = 100; //sætter kattens lykke-niveau til 100
      // Reducer vægten, hvis den er over normal
      if (this.catStatus.weight > 50) { //en if-statement som tjekker om kattens vægt er over 50
        this.catStatus.weight -= 5; //reducerer kattens vægt med 5
        if (this.catStatus.weight < 50) { //en if-statement som tjekker om kattens vægt er under 50
          this.catStatus.weight = 50; //sætter kattens vægt til 50 som en minimums vægtbegrænselse
        }
      }
      this.notification = 'Du har leget med katten!'; //besked der vises hvis brugeren har leget med katten
    },
    //håndterer rengøring af kattebakken, opdaterer hygiejne og trækker penge
    handleClean() { //metode der kaldes når brugeren renser kattens bakke
      const cleanCost = 5; //penge det koster at rense kattens bakke
      if (this.money >= cleanCost) { //en if-statement som tjekker om der er nok penge til at rense kattens bakke
        this.money -= cleanCost; //trækker penge fra brugerens pengebeholdning svarende til rengøringsprisen
        this.catStatus.hygiene = 100; //sætter kattens hygiejne-niveau til 100
        this.notification = 'Du har renset kattebakken!';
      } else { //en else-statement der kører hvis brugeren ikke har nok penge til at rense kattens bakke
        this.notification = 'Du har ikke nok penge til at rense kattebakken!';
      }
    },
    // håndterer healing af katten, hvis den er skadet, og trækker penge
    handleHeal() { //metode der kaldes når brugeren healer katten
      const healCost = 50; //penge det koster at heale katten
      if (this.money >= healCost && this.catStatus.injured) { //en if-statement som tjekker om der er nok penge til at heale katten og om katten er skadet
        this.money -= healCost; //trækker penge fra brugerens pengebeholdning svarende til helbredelsesprisen
        this.catStatus.injured = false; //sætter kattens skade til false
        this.notification = 'Du har healet katten!';
      } else if (this.catStatus.injured) { //en else-if statement der kører hvis katten er skadet
        this.notification = 'Du har ikke nok penge til at heale katten!';
      } else { //en else-statement der kører hvis katten ikke er skadet
        this.notification = 'Katten er ikke skadet.';
      }
    },
    //sikrer, at behovsværdierne ikke bliver negative
    handleNeedUpdate(need) { //metode der kaldes når der er behov for at opdatere kattens behov og sikrer at behovene ikke går under 0
      if (this.catStatus[need] <= 0) {
        this.catStatus[need] = 0;
      }
    },
    //bestemmer hvilken metode der skal kaldes baseret på handlingen fra drag-and-drop
    handleActionPerformed(action) {
      //bestemmer hvilken handling der skal udføres baseret på ikonet
      if (action === 'mdi-food') {
        this.handleFeed();
      } else if (action === 'mdi-tennis-ball') {
        this.handlePlay();
      } else if (action === 'mdi-emoticon-poop') {
        this.handleClean();
      } else if (action === 'mdi-medical-bag') {
        this.handleHeal();
      }
    },
    




    // reducerer liv for at give brugeren hjælp og viser en passende besked
    handleHelp() {
        //metode der Reducerer liv med 1 for at give hjælp til brugeren
      if (this.lives > 0) {
        this.lives--;
        let message = this.getHelpMessage(); //henter hjælpebeskeden fra getHelpMessage metoden baseret på kattens status
        if (this.lives <= 0) {
          this.stopTimers(); // Stopper spillet, hvis livene er opbrugt


          this.showStartAgain = true; // Vis popup'en i stedet for en notifikation. tilhøre StartAgain.vue


        }
        this.notification = message;
      } else {
        this.notification = 'Du har ingen liv tilbage!';
      }
    },

//--------------------------------------tilført start, tilhøre StartAgain.vue--------------------------------------//

     closePopup() {
       this.showRestartPopup = false; // Luk popup'en
      },

    // Nulstiller spillet
    resetGame() {
          this.lives = 9; // Reset liv
          this.money = 50; // Reset penge
          this.catStatus = {
            hunger: 100,
            happiness: 100,
            hygiene: 100,
            injured: false,
            weight: 50,
          };
          this.day = 1; // Reset dag
          this.notification = ''; // Nulstil notifikation
          this.showStartAgain = false; // Skjul restart popup
          this.startTimers(); // Genstart timerne
        },


//--------------------------------------tilført slut, tilhøre StartAgain.vue--------------------------------------//



    // genererer hjælpeteksten baseret på kattens nuværende tilstand
    getHelpMessage() {
      if (this.catStatus.injured) {
        return 'Katten er skadet! Heal den.';
      } else if (this.catStatus.hunger <= 30) {
        return 'Katten er sulten! Du skal fodre den.';
      } else if (this.catStatus.happiness <= 30) {
        return 'Katten vil lege! Brug legetøjet.';
      } else if (this.catStatus.hygiene <= 30) {
        return 'Kattebakken er beskidt! Rens den.';
      } else if (this.isOverweight) {
        return 'Katten er overvægtig! Leg med den for at hjælpe den med at tabe sig.';
      } else {
        return 'Katten har det godt lige nu!';
      }
    },
    // initialiserer alle timers, der styrer spillets dynamik over tid
    startTimers() {
      // Starter en timer, der håndterer sult
      this.hungerTimer = setInterval(() => {
        let hungerDecrease = 10;
        if (this.isOverweight) {
          hungerDecrease += 5; // Overvægtig kat bliver hurtigere sulten
        }
        this.catStatus.hunger -= hungerDecrease; // Reducerer kattens sultniveau
        if (this.catStatus.hunger <= 30 && this.catStatus.hunger > 0) { //en if-statement der kører hvis kattens sult-niveau er under 30
          this.notification = 'Miaw'; //besked der vises hvis kattens sult-niveau er under 30
        }
      }, 5000); // hver 5. sekund

      // timer for lykke 
      this.happinessTimer = setInterval(() => { //en timer der håndterer kattens lykke
        this.catStatus.happiness -= 10; // Reducerer kattens lykkestatus
        if (this.catStatus.happiness <= 30 && this.catStatus.happiness > 0) {
          this.notification = 'Miaw';
        }
      }, 7000); // hver 7. sekund

      // Hygiene timer
      this.hygieneTimer = setInterval(() => { //en timer der håndterer kattens hygiejne
        this.catStatus.hygiene -= 10;
        if (this.catStatus.hygiene <= 30 && this.catStatus.hygiene > 0) {
          this.notification = 'Miaw';
        }
      }, 9000); // hver 9. sekund

      // Timer for penge
      this.moneyTimer = setInterval(() => { //en timer der håndterer penge
        this.money += 5; //tilføjer 5 til brugerens pengebeholdning
      }, 5000); // hver 5. sekund

      // Timer for skade (sker ikke ligeså ofte)
      this.injuryTimer = setInterval(() => { //en timer der håndterer kattens skade
        let baseChance = 0.05; // 5% basechance for at katten bliver skadet
        if (this.isOverweight) {
          baseChance += 0.10; // Overvægtig kat har højere chance for at blive skadet (10%)
        }
        const chance = Math.random(); //tilfældig chance for at katten bliver skadet
        if (chance < baseChance && !this.catStatus.injured) { 
            //en if-statement der kører hvis katten ikke er skadet og chancen for at katten bliver skadet er under basechancen
          this.catStatus.injured = true; 
          this.notification = 'Miaw';
        }
      }, 10000); // hver 10. sekund

      // funktionen som håndtere logikken for livsnedgang
      this.livesDecreaseLogic = () => { 
        let interval = this.catStatus.injured ? 5000 : 10000; // Hurtigere livsnedgang hvis katten er skadet

        if ( //en if-statement der kører hvis katten er skadet, sult-niveauet, lykke-niveauet eller hygiejne-niveauet er under 30
          this.catStatus.injured ||
          this.catStatus.hunger <= 30 ||
          this.catStatus.happiness <= 30 ||
          this.catStatus.hygiene <= 30
        ) {
          this.lives--; //reducerer kattens liv med 1
          if (this.lives <= 0) {  //en if-statement der kører hvis katten har mistet alle sine liv
            this.lives = 0;

            this.showStartAgain = true; // Vis popup'en i stedet for en notifikation. tilhøre StartAgain.vue

            this.stopTimers();
            return;
          } else {
            this.notification = 'Miaw';
          }
        }

        // Nulstil timeren med det nye interval
        clearTimeout(this.livesDecreaseTimer); //nulstiller timeren
        this.livesDecreaseTimer = setTimeout(this.livesDecreaseLogic, interval); //starter timeren igen
      };

      // Start livsnedgangslogikken
      this.livesDecreaseTimer = setTimeout(this.livesDecreaseLogic, 10000); //starter livsnedgangslogikken efter 10 sekunder
    
    
    // dag: increments day by 1 each day
    // Kører logik for at tælle dagene op hver 24. time (86400 sekunder)
      this.dayTimer = setInterval(() => {
      this.day++; // Øger day-variablen med 1 hver gang denne timer kører
      }, 86400000); // 86400000 millisekunder = 24 timer
    
    
    },
    stopTimers() { //metode der stopper alle timers
      clearInterval(this.hungerTimer);
      clearInterval(this.happinessTimer);
      clearInterval(this.hygieneTimer);
      clearTimeout(this.livesDecreaseTimer);
      clearInterval(this.moneyTimer);
      clearInterval(this.injuryTimer);
      clearInterval(this.dayTimer);
    },
  },
  mounted() { //kaldes, når komponenten er monteret på DOM'en; starter timers
    this.startTimers();

    // Timer for at skjule DragDrop efter 1 minut
    setTimeout(() => {
      this.showDragDrop = false;
    }, 10000); // 20 sekunder = 20000 millisekunder

  },
  beforeUnmount() { //metode der kaldes, lige før komponenten fjernes fra DOM'en; stopper timers
    this.stopTimers();
  },
};
</script>

<style scoped>
.help-button {
  position: absolute; 
  top: 10px;
  right: 10px;
  width: 60px;
  height: 60px;
  z-index: 1;
}
.money-display {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 60px;
  height: 60px;
  z-index: 1;
}

.HomeContainer {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: aquamarine;
}

.icon-Button {
  position: fixed;
  bottom: 30px;
}

.progressBar {
  width: 50%;
  margin-top: 10px;
  position: absolute;
}

.dayNR {
  position: absolute;
  top: 10px;
  font-size: 20px;
  z-index: 1;
}

.gear-icon {
    position: absolute;
    top: 90px;
    right: 10px;
    z-index: 1;
}

.drag-drop {
  position: absolute;
  bottom: 130px;
  text-align: center;
}

:global(.custom-tooltip) {
  color: white !important;
  background-color: #66BB6A !important; 
  padding: 0.5rem 1rem !important;
}


</style>
