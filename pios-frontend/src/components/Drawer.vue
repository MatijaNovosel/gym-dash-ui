<template>
  <v-navigation-drawer
    v-model="drawerOpen"
    app
    clipped
    class="elevation-3"
    :class="{ 'grey lighten-3': !darkMode }"
    @input="inputChanged"
  >
    <v-list class="py-0">
      <v-list-item
        :to="{ name: RouteNames.USER_PROFILE, params: { id: user.id } }"
      >
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
import RouteNames from "../router/routeNames";
import { initials } from "../helpers/index";
import UserMixin from "../mixins/userMixin";
import DarkModeMixin from "../mixins/darkModeMixin";

export default {
  name: "drawer",
  props: {
    value: Boolean
  },
  mixins: [UserMixin, DarkModeMixin],
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
        token: null,
        role: null
      });
      this.$emit("show-snackbar", {
        color: "success",
        message: this.$t("logoutSuccess")
      });
      this.$emit("input", false);
      this.setDarkMode(false);
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
          route: { name: RouteNames.HOME }
        }
      ];

      if (this.isAdmin) {
        res.push({
          text: "Admin panel",
          icon: "mdi-account",
          route: { name: RouteNames.ADMIN_PANEL }
        });
      } else {
        res.push({
          text: "Membership",
          icon: "mdi-credit-card",
          route: { name: RouteNames.MEMBERSHIP }
        });
      }

      return res;
    }
  },
  data: () => ({
    drawerOpen: false,
    RouteNames
  })
};
</script>
