<template>
  <div class="drag-drop-wrapper">
    <v-img
      :width="100"
      aspect-ratio="1/1"
      cover
      src="@/assets/images/DragDrop.gif"
      alt="Drag and drop billede"
    ></v-img>
    <p>Træk og slip ikonet hen til katten.</p>
  </div>
</template>

<script>
export default {
  name: 'DragDrop'
}
</script>

<style scoped>
.drag-drop-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>

