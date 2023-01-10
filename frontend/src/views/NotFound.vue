<template>
  <v-card class="fill-height card-bg-color">
    <v-card-title align="center">404 page not found.</v-card-title>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NotFound",
});
</script>

<style scoped>
.card-bg-color {
  background: rgb(231, 240, 246);
}
</style>
