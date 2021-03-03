<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      disable-resize-watcher
      class="elevation-3 grey lighten-3"
    >
      <v-list>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title">
              Matija Novosel
            </v-list-item-title>
            <v-list-item-subtitle>mnovosel5@gmail.com</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list nav dense>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app class="white black--text elevation-1" clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span>Gym aplikacija</span>
      <v-spacer />
      <span>v{{ appVersion }}</span>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    drawer: false,
    appVersion: process.env.PACKAGE_VERSION,
    selectedItem: 0,
    items: [
      { text: "My Files", icon: "mdi-folder" },
      { text: "Shared with me", icon: "mdi-account-multiple" },
      { text: "Starred", icon: "mdi-star" },
      { text: "Recent", icon: "mdi-history" },
      { text: "Offline", icon: "mdi-check-circle" },
      { text: "Uploads", icon: "mdi-upload" },
      { text: "Log out", icon: "mdi-logout" }
    ]
  })
};
</script>
