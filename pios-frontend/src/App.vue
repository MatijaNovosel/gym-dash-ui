<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      Drawer content
    </v-navigation-drawer>
    <v-app-bar app class="white black--text">
      <div class="d-flex align-center">
        <span>Gym aplikacija</span>
      </div>
      <v-spacer />
      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <HelloWorld />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  components: {
    HelloWorld
  },
  data: () => ({
    drawer: false
  })
};
</script>
