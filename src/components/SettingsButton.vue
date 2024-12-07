<template>
  <div>
    <!-- Gear-knap til at åbne dialogen -->
    <v-btn icon @click="showDialog = true" class="gear-button">
      <SvgIcon class="gear" type="mdi" :path="mdiCog" />
    </v-btn>

    <!-- Indstillings-dialog -->
    <v-dialog v-model="showDialog" max-width="400px">
      <v-card>
        <!-- Titel og luk-ikon -->
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6">Indstillinger</span>
          <v-btn icon @click="showDialog = false">
            <SvgIcon type="mdi" :path="mdiClose" />
          </v-btn>
        </v-card-title>

        <v-card-text>
          <!-- Lydindstillinger -->
          <p class="mt-1">Lyd:</p>
          <v-btn @click="toggleMute" class="sound-button">
            <v-icon>{{ isMuted ? 'mdi-volume-off' : 'mdi-volume-high' }}</v-icon>
          </v-btn>

          <!-- Katte-størrelse -->
          <p class="mt-4">Kattestørrelse:</p>
          <div class="cat-size-buttons">
            <v-btn class="SizeBox" block @click="selectSize(0.7)">Lille</v-btn>
            <v-btn class="SizeBox" block @click="selectSize(1)">Mellem</v-btn>
            <v-btn class="SizeBox" block @click="selectSize(1.45)">Stor</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiCog, mdiClose } from "@mdi/js";

export default {
  components: {
    SvgIcon,
  },
  data() {
    return {
      showDialog: false,
      mdiCog,
      mdiClose,
      isMuted: false,
    };
  },
  methods: {
    selectSize(size) {
      this.$emit("size-changed", size);
    },
    toggleMute() {
      this.isMuted = !this.isMuted;
      this.$emit("mute-toggled", this.isMuted);
    },
  },
};
</script>

<style scoped>
.gear-button {
  background-color: #9e9e9e;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  text-align: center;
  padding: 15px;
}

.sound-button {
  background-color: #eee;
  color: black;
}


.settings-dialog {
  position: absolute !important;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  max-width: 90%;
}

.SizeBox {
  margin: 0 10px 10px 0;
}

</style>
