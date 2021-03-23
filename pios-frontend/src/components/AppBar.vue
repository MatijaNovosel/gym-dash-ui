<template>
  <v-app-bar
    app
    :class="{
      white: !darkMode
    }"
    class="elevation-1"
    clipped-left
  >
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')" />
    <v-icon>mdi-weight-lifter</v-icon>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>
          <span class="font-weight-bold grey--text">
            GymDash v{{ appVersion }}
          </span>
        </v-list-item-title>
        <v-list-item-subtitle>
          <span class="text-subtitle-2" v-if="isAdmin">
            <v-icon small color="red">mdi-account</v-icon>
            {{ $t("adminAccount") }}
          </span>
          <span class="text-subtitle-2" v-else>
            <v-icon small color="success">mdi-check-circle</v-icon>
            {{ $t("membershipValid") }}
          </span>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-spacer />
    <dark-mode-switch v-model="darkModeSwitchVal" @input="darkModeValChanged" />
  </v-app-bar>
</template>

<script>
import DarkModeSwitch from "./DarkModeSwitch.vue";
import debounce from "debounce";
import DarkModeMixin from "../mixins/darkModeMixin";
import UserMixin from "../mixins/userMixin";
import UserService from "../services/userService";

export default {
  name: "app-bar",
  components: {
    DarkModeSwitch
  },
  mixins: [DarkModeMixin, UserMixin],
  methods: {
    darkModeValChanged: debounce(async function() {
      await UserService.updatePreference(this.darkModeSwitchVal, "HR");
      this.setDarkMode(this.darkModeSwitchVal);
    }, 750)
  },
  created() {
    this.darkModeSwitchVal = this.darkMode;
  },
  data: () => ({
    appVersion: process.env.PACKAGE_VERSION,
    darkModeSwitchVal: false
  })
};
</script>
