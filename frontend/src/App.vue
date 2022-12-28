<template>
  <v-app>
    <Header />
    <!-- Main content -->
    <v-main>
      <v-container fluid class="fill-height pa-0 ma-0" >
            <!-- Render the component for the matching route -->
            <router-view />
      </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  VApp,
  VCol,
  VContainer,
  VList,
  VListItem,
  VListItemTitle,
  VNavigationDrawer,
  VRow

} from "vuetify/components";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  components: {
    Footer,
    Header,
  },
  data() {
    return {
      items: [],
      drawer: false
    };
  }
});
</script>
<style></style>
