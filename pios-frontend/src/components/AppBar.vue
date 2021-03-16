<template>
  <v-app-bar app class="white black--text elevation-1" clipped-left>
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
          <span class="text-subtitle-2">
            <v-icon small color="success">mdi-check-circle</v-icon>
            Membership is valid
          </span>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
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
