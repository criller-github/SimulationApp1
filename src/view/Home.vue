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

      <!-- Indsætter SettingsButton komponenten og lytter efter events fra den -->
      <SettingsButton class="gear-icon"
        @size-changed="updateCatSize" 
        @mute-toggled="toggleMute" 
      />

      <!-- Baggrundsmusik -->
      <audio 
        ref="bgMusic"
        :src="require('@/assets/sound/puzzle-game-loop-bright-casual-video-game-music-249201.mp3')" 
        autoplay 
        loop 
        style="display: none;">
      </audio>

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


      <!-- Knap til at vise kataloget -->
      <v-btn
      icon
      class="catalog-button"
      color="blue"
      @click="showCatalog = true"
      >
      <svg-icon type="mdi" :path="mdiStore"  :width="30" :height="30"></svg-icon>
      </v-btn>
      <CatCatalog 
      :visible="showCatalog" 
      :money="money" 
      @update:visible="val => showCatalog = val" 
      @item-purchased="handleItemPurchased" 
      />

      <!-- Livsindikator -->
      <!-- LifeIndicator er et komponent, der viser antallet af liv tilbage-->
      <LifeIndicator :lives="lives" />

      <!-- dagsnummer -->
      <v-progress-linear
      :model-value="(day / 7) * 100"
      :height="50"
      color="green"
      rounded
      class="progressBar"
      >
      <p class="dayNR"> DAG {{ day }} / 7</p>
      </v-progress-linear>

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
     
      <!--  Drag-and-drop komponenten -->
      <div v-if="showDragDrop" class="drag-drop">
        <DragDrop />
      </div>



      <!-- Handlingsknapper 
      - <v-row justify="center">: Wrapper til knapperne, centrerer indholdet horisontalt.
      - <ActionButtonComponent>: En genanvendelig komponent for hver handling (fodre, lege, rense, heale)
      - @mousedown/up/leave: Lytter efter en musenedtrykning/musenedslipning/musets forladelse på knappen
      - @touchstart/end/cancel: Lytter efter en touchstart/touchend/touchcancel på knappen
      - @action-performed: Lytter efter en event fra ActionButtonComponent, når brugeren interagerer med knappen
       -->
      <v-row justify="center" class="icon-Button">
        <ActionButtonComponent
          icon="mdi-food"
          label="Fodre" 
          :foodSelected="!!selectedFoodItem"
          @mousedown="startLongPress('mad')"
          @mouseup="endLongPress"
          @mouseleave="endLongPress"
          @touchstart="startLongPress('mad')"
          @touchend="endLongPress"
          @touchcancel="endLongPress"
          @action-performed="handleActionPerformed"
        />
        <!-- Popup-fold-ud-liste til viste items i inventory -->
        <template v-if="currentCategoryFoldout === 'mad'">
          <div class="foldout">
            <div class="pl-4">Dit købte fodder:</div>
            <v-container>
              <v-row>
                <v-col 
                  v-for="(it, idx) in filteredInventory('mad')" 
                  :key="idx" 
                  cols="12"
                  class="py-1"
                >
                  <v-card 
                    @click="selectItemForCategory(it)" 
                    color="red-darken-1"
                    class="py-2 px-2"
                  >
                    {{ it.title }} (x{{it.uses}})
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </template>
        <!-- 
        - @action-interaction event: Lytter efter en event fra ActionButtonComponent, når brugeren interagerer/starter/afslutter med knappen
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
//import CatResize from '@/components/CatResize.vue';
import CatComponent from '@/components/Cat.vue';
import LifeIndicator from '@/components/LifeIndicator.vue';
import ActionButtonComponent from '@/components/ActionButton.vue';
import NotificationComponent from '@/components/Notification.vue';
import StartAgain from '@/components/StartAgain.vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCurrencyUsd, mdiHelp, mdiAccountCircle, mdiStore} from '@mdi/js';
import DragDrop from '@/components/DragDrop.vue'
import SettingsButton from '@/components/SettingsButton.vue';
import CatCatalog from '@/components/CatCatalog.vue'; 

export default {
  name: 'HomeView',
  components: {
    DragDrop,
    CatComponent,
    LifeIndicator,
    ActionButtonComponent,
    NotificationComponent,
    StartAgain,
    SvgIcon,
    SettingsButton,
    CatCatalog,
  },

  watch: {
    // en watcher til at tilføre miaw tekster til ændringen af værdien af kattens status
    'catStatus.hunger'(newVal, oldVal) {
      if (newVal < 50 && oldVal >= 75) { // hvis sulten er under 50 og var over 75
        this.notification = 'Miaw!'; // viser en notifikation
        if (this.meowSound) { // hvis meowSound er defineret
        this.meowSound.currentTime = 0; // start fra begyndelsen
        this.meowSound.play(); // afspil lyden
      }
      }
    },
    'catStatus.happiness'(newVal, oldVal) {
      if (newVal < 50 && oldVal >= 75) {
        this.notification = 'Miaw!';
        if (this.meowSound) {
        this.meowSound.currentTime = 0;
        this.meowSound.play();
      }
      }
    },
    'catStatus.hygiene'(newVal, oldVal) {
      if (newVal < 50 && oldVal >= 75) {
        this.notification = 'Miaw!';
        if (this.meowSound) {
        this.meowSound.currentTime = 0;
        this.meowSound.play();
      }
      }
    },
    'catStatus.injured'(newVal, oldVal) {
      if (newVal === true && oldVal === false) {
        this.notification = 'Miaw!';
        if (this.meowSound) {
        this.meowSound.currentTime = 0;
        this.meowSound.play();
      }
      }
    },

    //når day ændres, gemmes den nye værdi i localStorage under nøglen catDay
    day(newDay) { //metode der kaldes når day ændres
    localStorage.setItem('catDay', newDay); //gemmer day i localStorage
    },
    catStatus: {
      handler(newStatus) { //metode der kaldes når catStatus ændres
        localStorage.setItem('catStatus', JSON.stringify(newStatus)); //gemmer catStatus i localStorage som en streng ved at bruge JSON.stringify
      },
      deep: true, //lytter efter ændringer i dybden af objektet for at gemme det korrekt i localStorage
    },
    currentProblem(newProblem) { //metode der kaldes når currentProblem ændres
      if (newProblem) { //hvis newProblem er sand
        localStorage.setItem('currentProblem', newProblem); //gemmer currentProblem i localStorage
      } else {
        localStorage.removeItem('currentProblem'); //ellers fjernes currentProblem fra localStorage
      }
    },
    lives(newLives) { //metode der kaldes når lives ændres
      localStorage.setItem('lives', newLives); //gemmer lives i localStorage
    },
    money(newMoney) {
      localStorage.setItem('money', newMoney); //gemmer money i localStorage
    },

    showStartAgain(newVal) { //metode der kaldes når showStartAgain ændres
      if (newVal === true) {
        // Når popup bliver vist:
        if (this.popupSound) {
          this.popupSound.currentTime = 0;
          this.popupSound.volume = 0.5;
          this.popupSound.muted = false; 
          this.popupSound.play().catch(err => {
            console.error("Kunne ikke afspille popup-lyd:", err);
          });
        }
      }
    },
  },

  data() {
    return {
      selectedFoodItem: null, // Holder styr på valgt mad
      showCatalog: false, // Holder styr på om kataloget er åbent
      inventory: JSON.parse(localStorage.getItem('inventory')) || [], // Inventory over købte ting
      isMuted: false, // Holder styr på om lyden er slået fra
      currentProblem: null, // Holder styr på det aktuelle problem
      lastProblem: null, // Holder styr på det sidst løste problem for at undgå gentagelser
      problems: ['hunger', 'happiness', 'hygiene', 'injured'], // Liste over mulige problemer
      lastInteractionTime: 0, // Tidspunkt for sidste interaktion
      day: 1, // Tracker dage
      lives: 9, // antal liv katten starter med
      money: 100, // startsantallet af penge
      mdiCurrencyUsd, mdiHelp, mdiAccountCircle, mdiStore,
      showMoneyTooltip: false, // Viser penge-tooltip
      isPlaying: false, // Holder styr på om brugeren leger med katten
      isCleaning: false, // Holder styr på om brugeren renser kattens bakke
      catStatus: {
        hunger: 100, // Kattens sultniveau
        hungerPausedUntil: null, // Tidspunkt for pause af sult for at give brugeren tid til at løse problemet
        happiness: 100, // Kattens lykkeniveau
        happinessPausedUntil: null,
        hygiene: 100,
        hygienePausedUntil: null,
        injured: false, // true eller false fordi at det er en boolean
        injuredPausedUntil: null,
        weight: 50,
        showDragDrop: false, // Vi initialiserer til false og sætter den baseret på localStorage
      },
      catSize: 1, // Standardstørrelse
      notification: '', // besked, der vises til brugeren
      meowSound: null, // tilføj en property til lyd
      showStartAgain: false, // Ny property til at styre popup'en. tilhøre StartAgain.vue
      popupSound: null,//popup-lyden
      showDragDrop: true, // Viser drag-and-drop komponenten
      notifiedStatuses: {
        hunger: false,
        happiness: false,
        hygiene: false,
        injured: false,
      },
      currentCategoryFoldout: null, // Holder styr på hvilken kategori, der er foldet ud
      longPressTimer: null, // Holder styr på timeren for langt tryk
      selectedItems: { // Holder styr på valgte items
        mad: null,
        legetøj: null,
        rengøring: null,
        medicin: null
      },
    };
  },
  computed: {
    //En beregnet property, der returnerer true, hvis kattens vægt er større eller lig med 100
    isOverweight() {
      return this.catStatus.weight >= 100;
    },
  },

  methods: {
    handleItemPurchased(item) { //metode der kaldes når brugeren køber et item
      if (this.money >= item.price) { // Hvis brugeren har nok penge til at købe item 
        this.money -= item.price; // Trækker prisen fra brugerens pengebeholdning 
        const existing = this.inventory.find(i => i.id === item.id); // Tjekker om item allerede er i inventory
        if (existing) { 
          // Hvis vi allerede har denne type item, læg uses oveni
          existing.uses += (item.uses || 10);
        } else {
          // Ellers tilføj item til inventory
          const purchasedItem = { ...item, uses: item.uses || 10 };
          this.inventory.push(purchasedItem);
        }
        localStorage.setItem('inventory', JSON.stringify(this.inventory)); // Gemmer inventory i localStorage
        this.notification = 'Vare købt!'; 
      } else {
        this.notification = 'Ikke nok penge!'; 
      }
    },

    //håndterer 1 sekunders tryk på knappen
    startLongPress(category) { //metode der kaldes når brugeren trykker på knappen
      if (this.filteredInventory(category).length > 0) {  // Hvis der er mad i inventory
        this.longPressTimer = setTimeout(() => { // Start en timer
          this.currentCategoryFoldout = category; // Fold kategorien ud
        }, 1000); // 1 sek lang tryk
      } else {
        this.notification = "Du har ingen mad til fodring! Køb dit fodder i katte kataloget.";
      }
    },
    endLongPress() { //metode der kaldes når brugeren slipper knappen
      clearTimeout(this.longPressTimer); // Ryd timeren
    },
    //returnerer kun de købte ting i den valgte kategori
    filteredInventory(category) {
      return this.inventory.filter(i => i.category === category);
    },
    //sætter det valgte item for en kategori og lukker foldout
    selectItemForCategory(item) {
      this.selectedFoodItem = item; 
      this.currentCategoryFoldout = null;
      this.notification = `Du har valgt ${item.title} til fodring!`;
    },

    //håndterer mute/unmute af baggrundsmusik
    toggleMute() {
      const audio = this.$refs.bgMusic;
      if (!audio) return;

      this.isMuted = !this.isMuted;
      audio.muted = this.isMuted;
    },

    // det næste problem, som katten skal have
    selectNextProblem() {
      const now = Date.now(); // Gemmer tidspunktet for nu fordi at det er en variabel og skal bruges flere gange
      let availableProblems = this.problems.filter(problem => { // Filter metoden bruges til at filtrere problemerne
      const pausedUntil = this.catStatus[`${problem}PausedUntil`]; // Gemmer tidspunktet for pause af problemet for at give brugeren tid til at løse det
      const isPaused = pausedUntil && pausedUntil > now; // Gemmer om problemet er sat på pause 
      return !isPaused; // Returnerer problemet, hvis det ikke er sat på pause
      });

      // Ekskluder det sidst løste problem for at undgå gentagelser
      availableProblems = availableProblems.filter(problem => problem !== this.lastProblem); 

      // Tjek om der er problemer ≤ 30
      const lowThresholdProblems = []; // Opretter en tom liste til problemer under eller lig med 30 

      if (this.catStatus.hunger <= 30) {
        lowThresholdProblems.push('hunger');
      }
      if (this.catStatus.happiness <= 30) {
        lowThresholdProblems.push('happiness');
      }
      if (this.catStatus.hygiene <= 30) {
        lowThresholdProblems.push('hygiene');
      }
      
      // Hvis der findes problemer under eller lig med 30, begræns valget til disse
      if (lowThresholdProblems.length > 0) {
        const criticalSet = availableProblems.filter(p => lowThresholdProblems.includes(p));
        if (criticalSet.length > 0) {
          availableProblems = criticalSet;
        }
      }

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
          this.notification = 'Miav!';
          if (this.meowSound) {
            this.meowSound.currentTime = 0; // start fra begyndelsen
            this.meowSound.play();
          }
          if (this.lives <= 0) {
            this.lives = 0;
            this.showStartAgain = true; //pop up vises
            this.stopTimers();
            // Nulstil dagstælleren og opdater localStorage
            this.day = 1;
            localStorage.setItem('catDay', this.day);

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
        if (this.catStatus.hunger === 100 && previousHunger < 100) {
          this.catStatus.hungerPausedUntil = Date.now() + 20000;
          if (this.currentProblem === 'hunger') {
          // Kun hvis det aktuelle problem er 'hunger' gives der liv.
            if (this.lives < 9) {
              this.lives++;
              this.notification = 'Du har fodret katten! Et liv er genoprettet.';
            } else {
              this.notification = 'Du har fodret katten!';
            }
            this.lastProblem = 'hunger';
            this.currentProblem = null;
            setTimeout(() => {
              this.selectNextProblem();
            }, 5000);
          } else {
            // Ikke det aktuelle problem -> ingen liv
            this.notification = 'Du har fodret katten!';
          }
        } else {
          this.notification = 'Du har fodret katten!';
        }
      } else { // Hvis brugeren ikke har nok penge
        this.notification = 'Du har ikke nok penge til at fodre katten!';
      }
    },

    // Håndterer leg med katten, opdaterer lykke og reducerer vægt, hvis nødvendigt
    handlePlay() {
      const previousHappiness = this.catStatus.happiness; // Gem tidligere lykkeværdi
      this.catStatus.happiness = 100; // Sæt lykke til 100
      // Reducer vægten, hvis over normal
      if (this.catStatus.weight > 50) {
        this.catStatus.weight -= 5;
        if (this.catStatus.weight < 50) {
          this.catStatus.weight = 50;
        }
      }

      // Tjek om lykken netop er nået 100 (fra under 100)
      if (previousHappiness < 100 && this.catStatus.happiness === 100) {
        this.catStatus.happinessPausedUntil = Date.now() + 20000; // Pause happiness i 20 sek.

        // Kun hvis det aktuelle problem er "happiness" gives der ekstra liv
        if (this.currentProblem === 'happiness') {
          if (this.lives < 9) {
            this.lives++;
            this.notification = 'Katten er nu glad! Et liv er genoprettet.';
          } else {
            this.notification = 'Katten er nu glad!';
          }
          this.lastProblem = 'happiness';
          this.currentProblem = null;
          setTimeout(() => {
            this.selectNextProblem();
          }, 5000);
        } else {
          // Ikke det aktuelle problem -> ingen ekstra liv
          this.notification = 'Katten er nu glad!';
          }
      } else {
        this.notification = 'Du har leget med katten!';
      }
    },

    //håndterer rengøring af kattebakken, opdaterer hygiejne og trækker penge
    handleClean() {
      const cleanCost = 5;
      if (this.money >= cleanCost) {
        const previousHygiene = this.catStatus.hygiene; // Gem tidligere hygiejneværdi
        this.money -= cleanCost;
        this.catStatus.hygiene = 100; // Sæt hygiejne til 100
        if (previousHygiene < 100 && this.catStatus.hygiene === 100) {
          this.catStatus.hygienePausedUntil = Date.now() + 20000; // Pause hygiene i 20 sek.
          // Kun hvis det aktuelle problem er "hygiene" gives der ekstra liv
          if (this.currentProblem === 'hygiene') {
            if (this.lives < 9) {
              this.lives++;
              this.notification = 'Katten er nu ren! Et liv er genoprettet.';
            } else {
              this.notification = 'Katten er nu ren!';
            }
            this.lastProblem = 'hygiene';
            this.currentProblem = null;
            setTimeout(() => {
              this.selectNextProblem();
            }, 5000);
          } else {
            // Ikke det aktuelle problem
            this.notification = 'Katten er nu ren!';
            }
        } else {
          this.notification = 'Du har renset kattebakken!';
        }
      } else {
        this.notification = 'Du har ikke nok penge til at rense kattebakken!';
      }
    },

    // håndterer healing af katten, hvis den er skadet, og trækker penge
    handleHeal() {
      const healCost = 50;
      if (this.money >= healCost && this.catStatus.injured) {
        const wasInjured = this.catStatus.injured; // Gem om katten var skadet
        this.money -= healCost;
        this.catStatus.injured = false;
        this.catStatus.injuredPausedUntil = Date.now() + 20000; // Pause "injured" i 20 sek.
        // Tjek om katten netop er helet fra skadet til ikke-skadet
        if (wasInjured && !this.catStatus.injured) {
          // Kun hvis det aktuelle problem er "injured" gives der ekstra liv
          if (this.currentProblem === 'injured') {
            if (this.lives < 9) {
              this.lives++;
              this.notification = 'Du har healet katten! Et liv er genoprettet.';
            } else {
              this.notification = 'Du har healet katten!';
            }
            this.lastProblem = 'injured';
            this.currentProblem = null;
            setTimeout(() => {
              this.selectNextProblem();
            }, 10000);
          } else {
            // Ikke det aktuelle problem
            this.notification = 'Du har healet katten!';
          }
        } else {
          this.notification = 'Du har healet katten!';
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
      if (!this.selectedFoodItem) {
        this.notification = "Du har ikke valgt noget mad! Hold fodder-knappen nede for at se din mad-inventar.";
        return;
      }
      // Brug data fra selectedFoodItem til at øge hunger og weight
      const previousHunger = this.catStatus.hunger;
      this.catStatus.hunger += this.selectedFoodItem.hungerGain;
      if (this.catStatus.hunger > 100) {
        this.catStatus.hunger = 100;
      }
      this.catStatus.weight += this.selectedFoodItem.weightGain;
      if (this.catStatus.weight > 150) {
        this.catStatus.weight = 150;
      }
      // Reducer uses med 1
      this.selectedFoodItem.uses--;
      // Tjek om uses er nået til 0 og fjern item hvis det er tilfældet
      if (this.selectedFoodItem.uses <= 0) {
        this.inventory = this.inventory.filter(item => item.id !== this.selectedFoodItem.id);
        this.notification = `Du har brugt op ${this.selectedFoodItem.title} og det er fjernet fra dit inventar!`;
        this.selectedFoodItem = null; // Nulstil valgt item
      } else {
        // Hvis uses ikke er 0, opdater notification
        this.notification = `Du har fodret katten med ${this.selectedFoodItem.title}!`;
      }
      // Opdater inventory i localStorage
      localStorage.setItem('inventory', JSON.stringify(this.inventory));
      // Håndter currentProblem hvis nødvendigt
      if (this.currentProblem === 'hunger' && previousHunger < 100 && this.catStatus.hunger === 100) {
        this.catStatus.hungerPausedUntil = Date.now() + 20000;
        if (this.lives < 9) {
          this.lives++;
          this.notification += ' Et liv er genoprettet.';
        }
        this.lastProblem = 'hunger';
        this.currentProblem = null;
        setTimeout(() => {
          this.selectNextProblem();
        }, 5000);
      }
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
      if (now - this.lastInteractionTime >= 200) { // Tjek om der er gået 200 ms siden sidste interaktion

        // Leg med katten (happiness)
        if (action === 'mdi-tennis-ball' && this.isPlaying) { // Hvis brugeren leger med katten og isPlaying er sand
          const previousHappiness = this.catStatus.happiness; // Gem tidligere lykkeværdi
          this.catStatus.happiness += 1; // Øg lykke med 1
          if (this.catStatus.happiness > 100) this.catStatus.happiness = 100; // Sørg for at lykke ikke går over 100

          // Reducer vægt hvis over normal
          if (this.catStatus.weight > 50) { // Hvis kattens vægt er over 50
            this.catStatus.weight -= 0.5; // Reducer vægt med 0.5
            if (this.catStatus.weight < 50) { // Sørg for at vægten ikke går under 50
              this.catStatus.weight = 50; // Sæt vægten til 50
            }
          }

          // Tjek om lykke netop nåede 100
          if (previousHappiness < 100 && this.catStatus.happiness === 100) { // Hvis lykke var under 100 og er nået til 100
            this.catStatus.happinessPausedUntil = Date.now() + 20000; // Pause happiness i 20 sekunder
            if (this.currentProblem === 'happiness') { // Hvis det aktuelle problem er lykke
              if (this.lives < 9) {
                this.lives++;
                this.notification = 'Katten er nu glad! Et liv er genoprettet.';
              } else {
                this.notification = 'Katten er nu glad!';
              }
              this.lastProblem = 'happiness';
              this.currentProblem = null; // Nulstil det aktuelle problem
              setTimeout(() => { // Vælg næste problem efter 5 sekunder
                this.selectNextProblem();
              }, 5000);
            } else {
              // Ikke det aktuelle problem
              this.notification = 'Katten er nu glad!';
            }
            this.isPlaying = false; // Sæt isPlaying til false for at stoppe lege
          }

        // Rense katten (hygiene)
        } else if (action === 'mdi-emoticon-poop' && this.isCleaning) {
          const previousHygiene = this.catStatus.hygiene;
          this.catStatus.hygiene += 1;
          if (this.catStatus.hygiene > 100) this.catStatus.hygiene = 100;

          // Tjek om hygiejne netop nåede 100
          if (previousHygiene < 100 && this.catStatus.hygiene === 100) {
            this.catStatus.hygienePausedUntil = Date.now() + 20000; // Pause hygiene

            if (this.currentProblem === 'hygiene') {
              if (this.lives < 9) {
                this.lives++;
                this.notification = 'Katten er nu ren! Et liv er genoprettet.';
              } else {
                this.notification = 'Katten er nu ren!';
              }
              this.lastProblem = 'hygiene';
              this.currentProblem = null;
              setTimeout(() => {
                this.selectNextProblem();
              }, 5000);
            } else {
              // Ikke det aktuelle problem
              this.notification = 'Katten er nu ren!';
            }
            this.isCleaning = false;
          }
        }
        this.lastInteractionTime = now;
      }
    },

    
    //håndterer starten af interaktionen
    handleInteractionStart(action) {
      if (action === 'mdi-tennis-ball') { // Hvis brugeren leger med katten
        this.isPlaying = true; // Sætter isPlaying til true
        this.notification = 'Bevæg legetøet frem og tilbage på katten!'; // Besked til brugeren
      } else if (action === 'mdi-emoticon-poop') { // Hvis brugeren renser kattens bakke
        this.isCleaning = true; // Sætter isCleaning til true
        this.notification = 'Bevæg børsten frem og tilbage på katten!'; // Besked til brugeren
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

    closePopup() {
      this.showRestartPopup = false; // Luk popup'en
    },

    // Nulstiller spillet
    resetGame() {
      this.lives = 9; // Reset liv
      this.money = 100; // Reset penge
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
      localStorage.setItem('catDay', this.day); // Opdater localStorage
      // Nulstil gemt katStatus i localStorage
      localStorage.removeItem('catStatus');
      localStorage.removeItem('currentProblem');
      // Fjern inventory fra localStorage og nulstil
      localStorage.removeItem('inventory');
      this.inventory = [];
      this.selectedFoodItem = null;
      this.currentCategoryFoldout = null;


      this.notification = ''; // Nulstil notifikation
      this.showStartAgain = false; // Skjul restart popup
      this.startTimers(); // Genstart timerne
      window.location.reload();
    },

    // genererer hjælpeteksten baseret på kattens nuværende tilstand
    getHelpMessage() {
      switch (this.currentProblem) {
      case 'injured':
        return 'Katten er skadet! Heal den.';
      case 'hunger':
        return 'Katten er sulten! Du skal fodre den.';
      case 'happiness':
        return 'Katten vil gerne lege! Prøv at brug legetøjet.';
      case 'hygiene':
        return 'Katten er beskidt! Rens den.';
      default:
        return 'Katten har det godt lige nu!';
    }
  },

  // initialiserer alle timers, der styrer spillets dynamik over tid
  startTimers() {
    // Timer for penge
    this.moneyTimer = setInterval(() => {
      this.money += 5; // Tilføjer 5 til brugerens pengebeholdning
    }, 5000); // Hver 5. sekund

    // Funktion, der håndterer logikken for livsnedgang
    this.livesDecreaseLogic = () => { 
      let interval = this.catStatus.injured ? 5000 : 10000; // Hurtigere livsnedgang, hvis katten er skadet
      if (
        this.catStatus.injured ||
        this.catStatus.hunger <= 30 ||
        this.catStatus.happiness <= 30 ||
        this.catStatus.hygiene <= 30
      ) {
        this.lives--; // Reducerer kattens liv med 1
        this.notification = 'Miav!';
        if (this.meowSound) {
          this.meowSound.currentTime = 0; // start fra begyndelsen
          this.meowSound.play();
        }
        if (this.lives <= 0) {
          this.lives = 0;
          this.showStartAgain = true; // Vis popup'en
          this.stopTimers();

          return;
          } else {
            this.notification = 'Miaw';
            if (this.meowSound) {
              this.meowSound.currentTime = 0; // start fra begyndelsen
              this.meowSound.play();
            }
          }
        }

      // Nulstil timeren med det nye interval
      clearTimeout(this.livesDecreaseTimer);
      this.livesDecreaseTimer = setTimeout(this.livesDecreaseLogic, interval);
    };

    // Start livsnedgangslogikken
    this.livesDecreaseTimer = setTimeout(this.livesDecreaseLogic, 10000); // Starter efter 10 sekunder

    // Start dagstælleren
    this.dayTimer = setInterval(() => {
      this.day++; // Øger dagen med 1
      if (this.day > 7) {
        this.day = 1;
      }
    }, 60000); // 1 minut til test; ændr til 86400000 for 24 timer

    // Håndter currentProblem
    if (this.currentProblem) {
      this.startProblemTimer();
      this.startProblemDecrease();
    } else {
      this.selectNextProblem();
    }
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
    this.popupSound = new Audio(require('@/assets/sound/brass-fail-11-a-207140.mp3'));
    this.meowSound = new Audio(require('@/assets/sound/cat-growl-96248.mp3')); 
    this.meowSound.volume = 0.5; // volume justering

    const audio = this.$refs.bgMusic;
    if (audio) {
      // Sæt lydniveauet til 10%
      audio.volume = 0.1;

      // Prøv at afspille lyden (nogle browsere kræver brugerinteraktion)
      audio.play().catch((error) => {
        console.log('Kan ikke autostarte musik:', error);
      });
    }

    // Indlæs gemt dag fra localStorage eller brug 1, hvis ikke tilgængelig
    const savedDay = localStorage.getItem('catDay');
    if (savedDay) {
      this.day = parseInt(savedDay, 10);
    } else {
      this.day = 1;
    }

    // Indlæs gemt catStatus fra localStorage eller brug standardværdier
    const savedCatStatus = localStorage.getItem('catStatus');
    if (savedCatStatus) {
      this.catStatus = JSON.parse(savedCatStatus);
    } else {
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
    }

    // Indlæs gemt currentProblem fra localStorage eller sæt til null
    const savedCurrentProblem = localStorage.getItem('currentProblem');
    if (savedCurrentProblem && savedCurrentProblem !== "null" && savedCurrentProblem !== "undefined") {
      this.currentProblem = savedCurrentProblem;
    } else {
      this.currentProblem = null;
    }

    // Indlæs gemt lives fra localStorage eller brug 9
    const savedLives = localStorage.getItem('lives');
    if (savedLives) {
      this.lives = parseInt(savedLives, 10);
    } else {
      this.lives = 9;
    }

    // Indlæs gemt money fra localStorage eller brug 50
    const savedMoney = localStorage.getItem('money');
    if (savedMoney) {
      this.money = parseInt(savedMoney, 10);
    } else {
      this.money = 100;
    }

    // Hvis livene er 0 ved genindlæsning, vis popup
    if (this.lives <= 0) {
      this.showStartAgain = true;
    }

    // Tjek om brugeren har set DragDrop-komponenten før
    const hasSeenDragDrop = localStorage.getItem('hasSeenDragDrop');
    if (!hasSeenDragDrop) {
      // Brugeren har ikke set DragDrop endnu
      this.showDragDrop = true;

      // Vis DragDrop i 10 sekunder
      setTimeout(() => {
        this.showDragDrop = false;

        // Sæt flaget i localStorage
        localStorage.setItem('hasSeenDragDrop', 'true');
      }, 10000); // 10 sekunder
    } else {
      // Brugeren har allerede set DragDrop
      this.showDragDrop = false;
    }

    this.startTimers();

    // Timer for at skjule DragDrop efter 1 minut
    setTimeout(() => {
      this.showDragDrop = false;
    }, 10000); // 20 sekunder = 20000 millisekunder
  },

  beforeUnmount() { //metode der kaldes, lige før komponenten fjernes fra DOM'en; stopper timers

    const audio = this.$refs.bgMusic;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    this.stopTimers();
  },


};
</script>

<style scoped>
.mute-button {
  position: absolute;
  top: 10px;
  left: 70px;
  z-index: 999;
}

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

.catalog-button {
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


.foldout {
  position: absolute;
  bottom: 100px;
  left: 10px; /* Flytter foldout til venstre for knappen */
  background-color: rgba(255, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 2;
  transition: all 0.3s ease;
}

</style>
