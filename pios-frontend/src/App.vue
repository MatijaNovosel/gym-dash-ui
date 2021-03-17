<template>
  <v-app>
    <template v-if="shouldShowUi">
      <drawer @show-snackbar="showSnackbar" v-model="drawer" />
      <app-bar @toggle-drawer="drawer = !drawer" />
    </template>
    <v-main :class="{ 'grey lighten-3': !shouldShowUi }">
      <v-container :class="{ 'pa-0 ma-0': !shouldShowUi }">
        <router-view @show-snackbar="showSnackbar" />
      </v-container>
    </v-main>
    <v-snackbar
      app
      timeout="2000"
      v-model="snackbar"
      bottom
      :color="snackbarColor"
      content-class="text-center"
      rounded="lg"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-app>
</template>

<script>
import Drawer from "./components/Drawer";
import AppBar from "./components/AppBar";
import RouteNames from "./router/routeNames";
import DarkModeMixin from "./mixins/darkModeMixin";

export default {
  name: "App",
  components: {
    Drawer,
    AppBar
  },
  mixins: [DarkModeMixin],
  methods: {
    showSnackbar(data) {
      this.snackbarMessage = data.message;
      this.snackbarColor = data.color;
      this.snackbar = true;
    }
  },
  created() {
    this.$vuetify.theme.dark = this.darkMode;
  },
  updated() {
    this.$vuetify.theme.dark = this.darkMode;
  },
  watch: {
    darkMode: {
      deep: true,
      immediate: false,
      handler(val) {
        this.$vuetify.theme.dark = val;
      }
    }
  },
  computed: {
    shouldShowUi() {
      return ![RouteNames.LOGIN, RouteNames.REGISTER].includes(
        this.$route.name
      );
    }
  },
  data: () => ({
    drawer: false,
    snackbar: false,
    snackbarMessage: "",
    snackbarColor: "primary"
  })
};
</script>
