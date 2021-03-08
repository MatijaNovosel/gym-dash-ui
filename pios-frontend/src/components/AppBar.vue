<template>
  <v-app-bar app class="white black--text elevation-1" clipped-left>
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')" />
    <v-icon class="mr-3">mdi-weight-lifter</v-icon>
    <span class="font-weight-bold grey--text">GymDash</span>
    <v-spacer />
    <span>v{{ appVersion }}</span>
  </v-app-bar>
</template>

<script>
export default {
  name: "app-bar",
  data: () => ({
    appVersion: process.env.PACKAGE_VERSION
  })
};
</script>

<style></style>
