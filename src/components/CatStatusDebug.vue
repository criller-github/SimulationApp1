<!-- alt dette skal slettes, dette er kun for testing -->

<template>
  <div class="debug-panel">
    <h3>Kattens Status</h3>
    <ul>
      <li>Sult: {{ status.hunger }}</li>
      <li>Lykke: {{ status.happiness }}</li>
      <li>Hygiejne: {{ status.hygiene }}</li>
      <li>Skadet: {{ status.injured }}</li>
      <li>Vægt: {{ status.weight }}</li>
      <li>Liv: {{ lives }}</li>
      <li>Aktuelt problem: {{ currentProblem }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CatStatusDebug',
  props: {
    status: Object,
    lives: Number,
    currentProblem: String,
  },
};
</script>

<style scoped>
.debug-panel {
  position: absolute;
  top: 10px;
  right: 80px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border: 1px solid #ccc;
}
</style>
