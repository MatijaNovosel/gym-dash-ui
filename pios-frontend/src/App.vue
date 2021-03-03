<template>
  <v-app>
    <drawer v-model="drawer" />
    <app-bar @toggle-drawer="drawer = !drawer" />
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Drawer from "./components/Drawer";
import AppBar from "./components/AppBar";

export default {
  name: "App",
  components: {
    Drawer,
    AppBar
  },
  data: () => ({
    drawer: false
  })
};
</script>
