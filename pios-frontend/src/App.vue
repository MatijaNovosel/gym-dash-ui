<template>
  <v-app>
    <template v-if="shouldShowUi">
      <drawer v-model="drawer" />
      <app-bar @toggle-drawer="drawer = !drawer" />
    </template>
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
import RouteNames from "./router/routeNames";

export default {
  name: "App",
  components: {
    Drawer,
    AppBar
  },
  computed: {
    shouldShowUi() {
      return ![RouteNames.LOGIN, RouteNames.REGISTER].includes(
        this.$route.name
      );
    }
  },
  data: () => ({
    drawer: false
  })
};
</script>
