<!-- indeholder hovedlogikken og styrer spillets tilstand -->
<template>
  <v-app> <!-- v-app er en container til vores app og findes i vue biblotekket -->
    <v-container fluid class="HomeContainer"> <!--fluid attributten gør, at containeren strækker sig over hele bredden af skærmen-->
      <v-btn
        icon
        @click="handleHelp"
        class="help-button"
        color="grey darken-3"
      >
      <!-- viser ikonet fra Material Design Icons (MDI)-->
        <svg-icon type="mdi" :path="mdiHelp" :width="25" :height="25" color="white"></svg-icon>
      </v-btn>


      <!-- Debugging af kattens status (kun for testing) -->
      <CatStatusDebug
      :status="catStatus"
      :lives="lives"
      :currentProblem="currentProblem"/>


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


      <!-- Admin-knap -->
    <v-btn
      icon
      @click="$router.push('/admin')"
      class="admin-button"
      color="grey darken-3"
    >
    <svg-icon type="mdi" :path="mdiAccountCircle" color="white"></svg-icon>
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
        - :catSize="catSize": Sender catSize som prop til komponenten
        - :current-problem="currentProblem": Sender det aktuelle problem som prop til komponenten
        - @need-update="handleNeedUpdate": Lytter efter en event fra CatComponent, hvis der er behov for at opdatere noget i forælderen
        - @action-performed="handleActionPerformed": Håndterer handlinger udført via drag-and-drop på katten 
        - @show-notification="showNotification": Lytter efter en event fra CatComponent, hvis der er en besked, der skal vises til brugeren
        -->
      <CatComponent
        :status="catStatus"
        :catSize="catSize"
        :current-problem="currentProblem"
        @need-update="handleNeedUpdate"
        @action-performed="handleActionPerformed"
        @show-notification="showNotification"
      />
     
      <!-- Sender currentProblem som prop til CatComponent -->
      <div v-if="showDragDrop" class="drag-drop">
        <DragDrop />
      </div>



      <!-- Handlingsknapper 
      - <v-row justify="center">: Wrapper til knapperne, centrerer indholdet horisontalt.
      - <ActionButtonComponent>: En genanvendelig komponent for hver handling (fodre, lege, rense, heale)
      - icon prop: Angiver hvilket ikon der skal vises på knappen
      - @action-performed event: Lytter efter en event fra ActionButtonComponent, når en handling udføres
       -->
      <v-row justify="center" class="icon-Button">
        <ActionButtonComponent
          icon="mdi-food"
          label="Fodre" 
          @action-performed="handleActionPerformed"
        />
        <!-- 
        - @action-interaction event: Lytter efter en event fra ActionButtonComponent, når brugeren interagerer med knappen
        - @interaction-start event: Lytter efter en event fra ActionButtonComponent, når brugeren starter en interaktion
        - @interaction-end event: Lytter efter en event fra ActionButtonComponent, når brugeren afslutter en interaktion
         -->
        <ActionButtonComponent
          icon="mdi-tennis-ball"
          label="Leg"
          @action-performed="handleActionPerformed"
          @action-interaction="handleInteraction"
          @interaction-start="handleInteractionStart"
          @interaction-end="handleInteractionEnd"
        />
        <ActionButtonComponent
          icon="mdi-emoticon-poop"
          label="Rengør"
        @action-performed="handleActionPerformed"
        @action-interaction="handleInteraction"
        @interaction-start="handleInteractionStart"
        @interaction-end="handleInteractionEnd"
        />
        <ActionButtonComponent
          icon="mdi-medical-bag"
          label="Heal"
          @action-performed="handleActionPerformed"
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
import CatResize from '@/components/CatResize.vue';
import CatComponent from '@/components/Cat.vue';
import LifeIndicator from '@/components/LifeIndicator.vue';
import ActionButtonComponent from '@/components/ActionButton.vue';
import NotificationComponent from '@/components/Notification.vue';
import StartAgain from '@/components/StartAgain.vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCurrencyUsd, mdiHelp, mdiAccountCircle} from '@mdi/js';
import DragDrop from '@/components/DragDrop.vue'
import CatStatusDebug from '@/components/CatStatusDebug.vue';

export default {
  name: 'HomeView',
  components: {
    DragDrop,
    CatResize,
    CatComponent,
    LifeIndicator,
    ActionButtonComponent,
    NotificationComponent,
    StartAgain,
    SvgIcon,
    CatStatusDebug,
  },
  data() {
    return {
      currentProblem: null, // Holder styr på det aktuelle problem
      lastProblem: null, // Holder styr på det sidst løste problem for at undgå gentagelser
      problems: ['hunger', 'happiness', 'hygiene', 'injured'], // Liste over mulige problemer
      lastInteractionTime: 0, // Tidspunkt for sidste interaktion
      day: 1, // Tracker dage
      lives: 9, // antal liv katten starter med
      money: 50, // startsantallet af penge
      mdiCurrencyUsd, mdiHelp, mdiAccountCircle,
      showMoneyTooltip: false, // Viser penge-tooltip
      isPlaying: false, // Holder styr på om brugeren leger med katten
      isCleaning: false, // Holder styr på om brugeren renser kattens bakke
      catStatus: {
      hunger: 100, // Kattens sultniveau
      hungerPausedUntil: null, // Tidspunkt for pause af sult for at give brugeren tid til at løse problemet
      happiness: 100,
      happinessPausedUntil: null,
      hygiene: 100,
      hygienePausedUntil: null,
      injured: false, // true eller false fordi at det er en boolean
      injuredPausedUntil: null,
      weight: 50,
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
    // det næste problem, som katten skal have
    selectNextProblem() {
      const now = Date.now(); // Gemmer tidspunktet for nu fordi at det er en variabel og skal bruges flere gange
      let availableProblems = this.problems.filter(problem => { // Filter metoden bruges til at filtrere problemerne
      const pausedUntil = this.catStatus[`${problem}PausedUntil`]; // Gemmer tidspunktet for pause af problemet for at give brugeren tid til at løse det
      const isPaused = pausedUntil && pausedUntil > now; // Gemmer om problemet er sat på pause 
      console.log(`Problem: ${problem}, PausedUntil: ${pausedUntil}, IsPaused: ${isPaused}`); // Udskriver problemet, tidspunktet for pause og om problemet er sat på pause
      return !isPaused; // Returnerer problemet, hvis det ikke er sat på pause
      });

      // Ekskluder det sidst løste problem for at undgå gentagelser
      availableProblems = availableProblems.filter(problem => problem !== this.lastProblem); 
      console.log(`Available problems after excluding lastProblem (${this.lastProblem}):`, availableProblems);

      // Hvis ingen andre problemer er tilgængelige, tillad valg af det sidste problem igen
      if (availableProblems.length === 0) {
        availableProblems = this.problems.filter(problem => {
          const pausedUntil = this.catStatus[`${problem}PausedUntil`];
          const isPaused = pausedUntil && pausedUntil > now;
          return !isPaused;
          });

        // Hvis stadig ingen problemer er tilgængelige, prøv igen efter 1 sekund
        if (availableProblems.length === 0) { 
          setTimeout(() => {
          this.selectNextProblem();
          }, 1000);
        return;
        }
      }

      // Vælg et tilfældigt problem fra listen over tilgængelige problemer
      const randomIndex = Math.floor(Math.random() * availableProblems.length);
      const nextProblem = availableProblems[randomIndex]; // Gemmer det næste problem
      console.log(`Next problem selected: ${nextProblem}`); // Udskriver det næste problem
      this.currentProblem = nextProblem; // Opdaterer det aktuelle problem
      this.initiateProblem(this.currentProblem); // Starter problemet
    },

    // Starter et problem
    initiateProblem(problem) {
      this.currentProblem = problem; // Opdaterer det aktuelle problem

      // Start med at mindske det aktuelle problems niveau gradvist
      this.startProblemDecrease();

      // Start timeren for problemet
      this.startProblemTimer();

      //Switch-case statement, der bestemmer handlingen baseret på problemet
      switch (problem) { 
        case 'hunger':
          break;
        case 'happiness':
          break;
        case 'hygiene':
          break;
        case 'injured':
          this.catStatus.injured = true; // Skade opstår med det samme
          break;
        default:
          break;
      }
    },

    // Starter timeren for gradvis reduktion af problemet
    startProblemDecrease() {
      clearInterval(this.problemDecreaseTimer); // Ryd eventuelle eksisterende timere

      this.problemDecreaseTimer = setInterval(() => { // Starter en ny timer
        const decreaseAmount = Math.floor(Math.random() * 10) + 1; // Tilfældigt tal mellem 1 og 10
        const now = Date.now(); // Gemmer tidspunktet for nu

        // Sult
        if (!this.catStatus.hungerPausedUntil || this.catStatus.hungerPausedUntil <= now) { // Hvis sult ikke er sat på pause
          this.catStatus.hunger -= decreaseAmount; // Reducer sult
          if (this.catStatus.hunger < 0) this.catStatus.hunger = 0; // Sørg for at sult ikke går under 0
        }

        // Lykke
        if (!this.catStatus.happinessPausedUntil || this.catStatus.happinessPausedUntil <= now) {
          this.catStatus.happiness -= decreaseAmount;
          if (this.catStatus.happiness < 0) this.catStatus.happiness = 0;
        }

        // Hygiejne
        if (!this.catStatus.hygienePausedUntil || this.catStatus.hygienePausedUntil <= now) {
          this.catStatus.hygiene -= decreaseAmount;
          if (this.catStatus.hygiene < 0) this.catStatus.hygiene = 0;
        }

        // Skade
        

      }, 10000); // Hvert 10. sekund
    },

    // Starter timeren for problemet
    startProblemTimer() {
      // Ryd eventuelle eksisterende timere
      clearInterval(this.problemTimer);

      // Tjek hvert sekund, om behovet er nået til nul
      this.problemTimer = setInterval(() => {
        let problemUnresolved = false;

          switch (this.currentProblem) {
            case 'hunger':
            if (this.catStatus.hunger <= 0) {
              problemUnresolved = true;
            }
            break;
            case 'happiness':
            if (this.catStatus.happiness <= 0) {
              problemUnresolved = true;
            }
            break;
            case 'hygiene':
            if (this.catStatus.hygiene <= 0) {
              problemUnresolved = true;
            }
            break;
            case 'injured':
            // da injured er en boolean og ikke et tal, er det ikke nødvendigt at tjekke for 0
            break;
            default:
            break;
          }

        if (problemUnresolved) {
          // Reducer liv
          this.lives--;
          if (this.lives <= 0) {
            this.lives = 0;
            this.showStartAgain = true;
            this.stopTimers();
            return;
          }
          // Notifikation til brugeren
          this.notification = 'Du løste ikke problemet i tide!';
          // Ryd timere og vælg næste problem
          this.clearProblemTimers();
          this.currentProblem = null;
          this.selectNextProblem();
        }
      }, 1000); // Tjek hvert sekund
    },

    // Stopper alle timere
    clearProblemTimers() {
      clearInterval(this.problemDecreaseTimer);
      clearInterval(this.problemTimer);
    },
    startPlaying() { //metode der kaldes når brugeren leger med katten
      this.isPlaying = true;
    },
    startCleaning() { //metode der kaldes når brugeren renser kattens bakke
      this.isCleaning = true;
    },
    //metode der viser penge-tooltip
    toggleMoneyTooltip() {
      this.showMoneyTooltip = true;
      setTimeout(() => {
        this.showMoneyTooltip = false;
      }, 2000);
    },
    //Cat.vue emitter en event (show-notification) med den hentede tekst, som modtages i Home.vue
    showNotification(message) { //Vi lytter efter show-notification-eventen fra CatComponent og opdaterer notification
      this.notification = message; //notification bruges i NotificationComponent til at vise teksten i Snackbar
    },
    
    updateCatSize(size) {
      this.catSize = size; // Opdaterer størrelsen af katten
    },

    // Håndterer fodringshandlingen, opdaterer kattens sult, vægt, liv og brugerens penge
    handleFeed() {
      const foodCost = 10; // Prisen for mad
      if (this.money >= foodCost) { // Hvis brugeren har nok penge
        this.money -= foodCost; // Trækker penge fra brugerens pengebeholdning

        // Gem tidligere sultniveau for at tjekke om det når 100
        const previousHunger = this.catStatus.hunger;

        // Øg sultniveauet med 20, op til maksimum 100
        this.catStatus.hunger += 20;
        if (this.catStatus.hunger > 100) {
          this.catStatus.hunger = 100;
        }

        // Øg vægten
        this.catStatus.weight += 5;
        if (this.catStatus.weight > 150) {
          this.catStatus.weight = 150;
        }

        // Tjek om sultniveauet har nået 100
        if (this.catStatus.hunger === 100 && previousHunger < 100) { // Hvis sultniveauet har nået 100
          this.catStatus.hungerPausedUntil = Date.now() + 20000; // Sæt sult på pause i 20 sekunder

          // Øg liv, når behovet når 100
          if (this.lives < 9) {
            this.lives++;
            this.notification = 'Du har fodret katten! Et liv er genoprettet.';
          } else {
            this.notification = 'Du har fodret katten!';
          }

          // Hvis det aktuelle problem er 'hunger', løses det
          if (this.currentProblem === 'hunger') {
            this.lastProblem = 'hunger'; // Opdater lastProblem
            this.currentProblem = null; // Nulstil currentProblem
            setTimeout(() => { // Vælg næste problem efter 2 sekunder
              this.selectNextProblem();
            }, 2000);
          }
        } else { // hvis brugeren har fuldt liv og sultniveauet er 100
        this.notification = 'Du har fodret katten!';
        }
      } else { // Hvis brugeren ikke har nok penge
        this.notification = 'Du har ikke nok penge til at fodre katten!';
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
    handleHeal() {
      const healCost = 50;
      if (this.money >= healCost && this.catStatus.injured) { // Hvis brugeren har nok penge og katten er skadet
        this.money -= healCost;
        this.catStatus.injured = false;

        // Pause skade i 20 sekunder
        this.catStatus.injuredPausedUntil = Date.now() + 20000;

        // Øg liv
        if (this.lives < 9) {
          this.lives++;
          this.notification = 'Du har healet katten! Et liv er genoprettet.';
        } else {
          this.notification = 'Du har healet katten!';
        }

        if (this.currentProblem === 'injured') {
          this.lastProblem = 'injured'; // Opdater lastProblem
          this.currentProblem = null;
          setTimeout(() => {
            this.selectNextProblem();
          }, 2000);
        }
      } else if (this.catStatus.injured) {
        this.notification = 'Du har ikke nok penge til at heale katten!';
      } else {
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
      if (action === 'mdi-food') {
        this.handleFeed(); // Kald handleFeed() i stedet for at ændre hunger direkte
      } else if (action === 'mdi-tennis-ball') {
      // Start leg interaktion
      this.isPlaying = true;
      } else if (action === 'mdi-emoticon-poop') {
        // Start rengøringsinteraktion
        this.isCleaning = true;
      } else if (action === 'mdi-medical-bag') {
        // Heal katten
        this.handleHeal();
      }
    },
    
    //håndterer interaktioner med katten
    handleInteraction(action) {
      const now = Date.now();
      if (now - this.lastInteractionTime >= 200) { // Tjekker om der er gået 200 millisekunder siden sidste interaktion
        if (action === 'mdi-tennis-ball' && this.isPlaying) { // Hvis brugeren leger med katten
          const previousHappiness = this.catStatus.happiness; // Gem tidligere lykke

          // Øg lykke
          this.catStatus.happiness += 1; 
          if (this.catStatus.happiness > 100) this.catStatus.happiness = 100; // Sørg for at lykke ikke går over 100

          // Reducer vægten med 1, ned til minimum 50
          if (this.catStatus.weight > 50) {
            this.catStatus.weight -= 0.5;
            if (this.catStatus.weight < 50) {
              this.catStatus.weight = 50;
            }
          }

          // Tjek om lykke har nået 100
          if (previousHappiness < 100 && this.catStatus.happiness === 100) {
            this.notification = 'Katten er nu glad!';
            this.isPlaying = false;

            // Pause lykke i 20 sekunder
            this.catStatus.happinessPausedUntil = Date.now() + 20000;

            // Øg liv, når behovet når 100
            if (this.lives < 9) {
              this.lives++;
              this.notification += ' Et liv er genoprettet.';
            }

            // Hvis det aktuelle problem er 'happiness', løses det
            if (this.currentProblem === 'happiness') {
              this.lastProblem = 'happiness'; // Opdater lastProblem
              this.currentProblem = null;
              setTimeout(() => {
                this.selectNextProblem();
              }, 2000);
            }
          }
        } else if (action === 'mdi-emoticon-poop' && this.isCleaning) { // Hvis brugeren renser kattens bakke
          const previousHygiene = this.catStatus.hygiene; // Gem tidligere hygiejne
          this.catStatus.hygiene += 1; // Øg hygiejne
          if (this.catStatus.hygiene > 100) this.catStatus.hygiene = 100; // Sørg for at hygiejne ikke går over 100
          if (previousHygiene < 100 && this.catStatus.hygiene === 100) { // Tjek om hygiejne har nået 100
            this.notification = 'Katten er nu ren!'; // Besked til brugeren
            this.isCleaning = false; // Afslut rengøringsinteraktionen

            // Pause hygiejne i 20 sekunder
            this.catStatus.hygienePausedUntil = Date.now() + 20000;

            // Øg liv, når behovet når 100
            if (this.lives < 9) {
              this.lives++;
              this.notification += ' Et liv er genoprettet.';
            }

            if (this.currentProblem === 'hygiene') {
              this.lastProblem = 'hygiene'; // Opdater lastProblem
              this.currentProblem = null;
              setTimeout(() => {
                this.selectNextProblem();
              }, 2000);
            }
          }
        }
        this.lastInteractionTime = now;
      }
    },
    
    //håndterer starten af interaktionen
    handleInteractionStart(action) {
      if (action === 'mdi-tennis-ball') { // Hvis brugeren leger med katten
        this.isPlaying = true; // Sætter isPlaying til true
        this.notification = 'Du leger med katten'; // Besked til brugeren
      } else if (action === 'mdi-emoticon-poop') { // Hvis brugeren renser kattens bakke
        this.isCleaning = true; // Sætter isCleaning til true
        this.notification = 'Du renser katten!'; // Besked til brugeren
      }
    },
    handleInteractionEnd(action) { //metode der kaldes når brugeren afslutter en interaktion
      if (action === 'mdi-tennis-ball') { // Hvis brugeren leger med katten
        this.isPlaying = false;
      } else if (action === 'mdi-emoticon-poop') { // Hvis brugeren renser katten
        this.isCleaning = false;
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
    hungerPausedUntil: null,
    happiness: 100,
    happinessPausedUntil: null,
    hygiene: 100,
    hygienePausedUntil: null,
    injured: false,
    injuredPausedUntil: null,
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
      this.selectNextProblem();
     

      // Timer for penge
      this.moneyTimer = setInterval(() => { //en timer der håndterer penge
        this.money += 5; //tilføjer 5 til brugerens pengebeholdning
      }, 5000); // hver 5. sekund

     

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
      this.clearProblemTimers();
      clearTimeout(this.problemTimer);
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

.admin-button {
  position: absolute;
  top: 90px;
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
  background-color: rgb(255, 241, 241);
  background-image: url('@/assets/images/room.png');
  background-repeat:no-repeat;
  -webkit-background-size:cover;
  -moz-background-size:cover;
  -o-background-size:cover;
  background-size:cover;
  background-position:center;
  /* ud fra https://stackoverflow.com/questions/12609110/responsive-css-background-images */  
}



.icon-Button {
  position: fixed;
  bottom: 30px;
  z-index: 1;
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
  color: white;
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

:global(.progressBar) {
  background-color: rgba(102, 187, 106, 0.5) !important;
}



</style>
