<!-- knapper til brugerinteraktion (fodre, lege, rense, heale) -->
<template>

  <!-- Knapperne modtager ikonnavnet og label fra forælderen (Home.vue) -->
  <!-- Når brugeren interagerer med knapperne, udsendes der events til forælderen (Home.vue) -->
  <!-- Når brugeren trækker en knap hen over katten, udsendes der en event til forælderen (Home.vue) -->

  <v-btn
  stacked
  class="action-button"
  @mousedown="onPointerDown"
  @touchstart.prevent="onPointerDown"
>
  <v-icon class="icon">{{ icon }}</v-icon>
  <span>{{ label }}</span>
</v-btn>
</template>


<script>
export default {
  name: 'ActionButton',
  props: {
    // Modtager ikonnavnet fra parent (home.vue)
    icon: String, // Modtager label fra parent (home.vue)
    label: String, // Modtager om mad er valgt fra parent (home.vue)
    foodSelected: Boolean // Modtager om mad er valgt fra parent (home.vue)
  },
  methods: {
    // @vuese
    // Metode til at håndtere event listeners for bevægelse og frigivelse af klik/touch på vinduet afhængigt af inputtype og udsende en event (interaction-start) når interaktionen starter
    onPointerDown(event) {
      event.preventDefault(); // Forhindrer standard adfærd

      // Tilføjer event listeners for bevægelse og frigivelse af klik/touch på vinduet afhængigt af inputtype
      if (event.type === 'mousedown') { // Hvis inputtypen er mus
        this.startX = event.clientX; // Gemmer x-koordinatet for museklikket
        this.startY = event.clientY; // Gemmer y-koordinatet for museklikket
        window.addEventListener('mousemove', this.onPointerMove); // Tilføjer event listener til musens bevægelse
        window.addEventListener('mouseup', this.onPointerUp); // Tilføjer event listener til musens frigivelse
      } else if (event.type === 'touchstart') { // Hvis inputtypen er touch
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
        window.addEventListener('touchmove', this.onPointerMove, { passive: false });
        window.addEventListener('touchend', this.onPointerUp);
      }

      // Opret drag-billedet og flyt det til museklikket/touchet
      this.createDragImage(event);

      // Udsend event når interaktionen starter (når brugeren klikker/toucher på knappen)
      this.$emit('interaction-start', this.icon);
    },

    // @vuese
    // Håndterer positionen af drag-billedet og interaktionen med katten
    onPointerMove(event) {
      // Forhindrer standard scroll-adfærd på touch-enheder
      event.preventDefault();

      // Opdater positionen af drag-billedet
      let clientX, clientY; // Initialiserer variabler til x- og y-koordinater
      if (event.type === 'mousemove') { // Hvis inputtypen er mus
        clientX = event.clientX; // Gemmer x-koordinatet for musebevægelsen
        clientY = event.clientY;
      } else if (event.type === 'touchmove') { // Hvis inputtypen er touch
        clientX = event.touches[0].clientX; // Gemmer x-koordinatet for touchbevægelsen
        clientY = event.touches[0].clientY;
      }

      this.moveDragImage(clientX, clientY); // Flytter drag-billedet til den nye position

      // Tjekker for interaktion med katten
      this.checkInteraction(event);
    },

    // @vuese
    // Håndterer musefrigivelse/touchfrigivelse og fjerne event listeners (interaction-end), drag-billedet og tjekker for droppet over katten og udsender en event når interaktionen slutter
    onPointerUp(event) {
      // Fjerner event listeners
      if (event.type === 'mouseup') { // Hvis inputtypen er mus
        window.removeEventListener('mousemove', this.onPointerMove); // Fjerner event listener for musens bevægelse
        window.removeEventListener('mouseup', this.onPointerUp); // Fjerner event listener for musens frigivelse
      } else if (event.type === 'touchend') {
        window.removeEventListener('touchmove', this.onPointerMove);
        window.removeEventListener('touchend', this.onPointerUp);
      }

      // Fjern drag-billedet
      this.removeDragImage();

      // Tjek om droppet skete over katten
      this.checkDrop(event);

      // Udsend event når interaktionen slutter
      this.$emit('interaction-end', this.icon);
    },

    // @vuese
    // Opretter et billede, der repræsenterer det trukkede element og indstiller dets position
    createDragImage(event) {
      const imgSrc = this.getDragImageSrc();
      // Hvis imgSrc er en tom streng, returner uden at lave et billede
      if (!imgSrc) {
        return; 
      }
      // Opretter et billede, der repræsenterer det trukne element
      this.dragImage = document.createElement('img'); // Opretter et img-element
      this.dragImage.src = this.getDragImageSrc(); // Sætter src-attributten til det korrekte billede baseret på handlingen
      this.dragImage.style.position = 'absolute'; // Sætter positionen til absolut
      this.dragImage.style.zIndex = '1000'; // Sætter z-index til 1000 for at sikre, at billedet vises over alt andet
      this.dragImage.style.pointerEvents = 'none'; // Sætter pointer-events til none for at undgå, at billedet påvirker andre elementer
      this.dragImage.style.width = '100px'; // Sætter bredden til 100px
      this.dragImage.style.height = '100px';
      document.body.appendChild(this.dragImage); // Tilføjer billedet til body

      // Initial position
      let clientX, clientY; // Initialiserer variabler til x- og y-koordinater
      if (event.type === 'mousedown') { // Hvis inputtypen er mus
        clientX = event.clientX; // Gemmer x-koordinatet for museklikket
        clientY = event.clientY;
      } else if (event.type === 'touchstart') { // Hvis inputtypen er touch
        clientX = event.touches[0].clientX; // Gemmer x-koordinatet for touchklikket
        clientY = event.touches[0].clientY;
      }

      this.moveDragImage(clientX, clientY); // Flytter drag-billedet til den nye position
    },

    // @vuese
    // Flytter drag-billedet til den nye position og centrerer det over musen/touchet
    moveDragImage(clientX, clientY) { // Flytter drag-billedet til den nye position
      if (this.dragImage) { // Hvis drag-billedet eksisterer
        this.dragImage.style.left = `${clientX - 50}px`; // Sætter left-attributten til x-koordinaten minus halvdelen af billedets bredde
        this.dragImage.style.top = `${clientY - 50}px`;
      }
    },

    // @vuese
    // Fjerner drag-billedet fra DOM og nulstiller det
    removeDragImage() {
      if (this.dragImage) { // Hvis drag-billedet eksisterer
        document.body.removeChild(this.dragImage); // Fjerner drag-billedet fra body
        this.dragImage = null; // Nulstiller drag-billedet
      }
    },

    // @vuese
    // Tjekker for interaktion med katten og udsender en event (action-interaction), hvis drag-billedet er over katten
    checkInteraction(event) {
      let clientX, clientY; // Initialiserer variabler til x- og y-koordinater
      if (event.type === 'mousemove') { // Hvis inputtypen er mus
        clientX = event.clientX; // Gemmer x-koordinatet for musebevægelsen
        clientY = event.clientY;
      } else if (event.type === 'touchmove') {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      }

      const catElement = document.querySelector('.cat-image'); // Få fat i kattens element
      const catRect = catElement.getBoundingClientRect(); // Få kattens elements position

      if ( // Tjek om musebevægelsen/touchbevægelsen er over katten
        clientX >= catRect.left &&
        clientX <= catRect.right &&
        clientY >= catRect.top &&
        clientY <= catRect.bottom
      ) {
        // Udsend en event hver gang drag-billedet er over katten
        this.$emit('action-interaction', this.icon);
      }
    },

    // @vuese
    // Tjekker om droppet skete over katten og udsender en event (action-performed), hvis det gjorde
    checkDrop(event) {
      // Få positionen hvor brugeren frigav
      let clientX, clientY;
      if (event.type === 'mouseup') { // Hvis inputtypen er mus
        clientX = event.clientX;
        clientY = event.clientY;
      } else if (event.type === 'touchend' && event.changedTouches.length > 0) { // Hvis inputtypen er touch
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
      } else {
        // Kan ikke bestemme position
        return;
      }

      // Få kattens elements position
      const catElement = document.querySelector('.cat-image'); // Få fat i kattens element
      const catRect = catElement.getBoundingClientRect(); // Få kattens elements position

      // Tjek om droppet skete over katten
      if (
        clientX >= catRect.left &&
        clientX <= catRect.right &&
        clientY >= catRect.top &&
        clientY <= catRect.bottom
      ) {
        this.$emit('action-performed', this.icon);
      }
    },

    // @vuese
    // Returnerer stien til drag-billedet baseret på hvilken handling, der er valgt (ikon)
    getDragImageSrc() {
      switch (this.icon) {
        case 'mdi-food':
        // if-statement til at bestemme hvilket billede, der skal vises, baseret på om madknappen er valgt
        if (this.foodSelected) {
          // hvis der er valgt mad i inventory, vis madskålen
          return require('@/assets/images/food_bowl.png');
        } else {
          //hvis der ikke er valgt mad, returner en tom streng, så der ikke vises noget billede
          return '';
        }
        case 'mdi-tennis-ball':
          return require('@/assets/images/cat_toy.png');
        case 'mdi-emoticon-poop':
          return require('@/assets/images/brush.png');
        case 'mdi-medical-bag':
          return require('@/assets/images/pill.png');
        default:
          return '';
      }
    },
  },

  data() {
    return { 
      dragImage: null, // Initialiserer drag-billedet til null
      startX: 0, // Initialiserer x-koordinatet for museklikket/touchet til 0
      startY: 0, // Initialiserer y-koordinatet for museklikket/touchet til 0
    };
  },
};
</script>

<style scoped>
.action-button {
  width: 5rem;
  height: 5rem;
  margin: 10px;
  color: white;
  background-color: rgba(255, 0, 0, 0.5);

}
.icon{
  font-size: 50px;
}

</style>
