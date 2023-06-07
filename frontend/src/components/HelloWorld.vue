<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
});
</script>
<template>
  <v-container class="fill-height" style="display: flex; align-items: center; justify-content: center" />
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 80%;
  border: 0.5px solid #ccc;
}

th,
td {
  text-align: left;
  padding: 2px;
  color: #333;
  border-right: 0.5px solid #ccc;
}
th:last-child,
td:last-child {
  border-right: none;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:not(:last-child) {
  border-bottom: 2px solid #ddd;
}
</style>
