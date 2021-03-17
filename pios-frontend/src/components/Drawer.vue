<template>
  <v-navigation-drawer
    v-model="drawerOpen"
    app
    clipped
    class="elevation-3 grey lighten-3"
    @input="inputChanged"
  >
    <v-list>
      <v-list-item>
        <v-avatar size="40" color="primary" class="mr-3">
          <span class="white--text">{{ initials(user.username) }}</span>
        </v-avatar>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ user.username }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider />
    <v-list nav dense>
      <v-list-item
        exact
        v-for="(item, i) in items"
        :key="i"
        :to="item.route"
        color="primary"
      >
        <v-list-item-icon>
          <v-icon v-text="item.icon" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.text" />
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="logOut" color="primary">
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Log out</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import routeNames from "../router/routeNames";
import { initials } from "../helpers/index";
import UserMixin from "../mixins/userMixin";

export default {
  name: "drawer",
  props: {
    value: Boolean
  },
  mixins: [UserMixin],
  methods: {
    initials,
    inputChanged(val) {
      this.drawerOpen = val;
      this.$emit("input", val);
    },
    logOut() {
      this.setUser({
        id: null,
        username: null,
        email: null,
        token: null
      });
      this.$emit("show-snackbar", {
        color: "success",
        message: this.$t("logoutSuccess")
      });
      this.$emit("input", false);
      this.$router.push({ name: "login" });
    }
  },
  watch: {
    value(val) {
      this.drawerOpen = val;
    }
  },
  computed: {
    items() {
      const res = [
        {
          text: "Home",
          icon: "mdi-home",
          route: { name: routeNames.HOME }
        },
        {
          text: "Membership",
          icon: "mdi-credit-card",
          route: { name: routeNames.MEMBERSHIP }
        }
      ];

      if (this.isAdmin()) {
        res.push({
          text: "Admin panel",
          icon: "mdi-account",
          route: { name: routeNames.ADMIN_PANEL }
        });
      }

      return res;
    }
  },
  data: () => ({
    drawerOpen: false
  })
};
</script>
