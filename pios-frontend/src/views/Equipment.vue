<template>
  <v-row class="mt-0">
    <template v-for="n in 12">
      <v-col cols="12" md="3" :key="n">
        <v-card>
          <v-card-title>
            Title
          </v-card-title>
          <v-card-subtitle>
            Subtitle
          </v-card-subtitle>
          <v-divider />
          <v-card-text>
            Text
          </v-card-text>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>

<script>
export default {};
</script>
