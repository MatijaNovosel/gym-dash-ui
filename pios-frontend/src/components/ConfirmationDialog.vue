<template>
  <v-dialog persistent v-model="open" max-width="400px">
    <v-card :style="{ maxHeight }">
      <v-card-title>
        <div class="text-center" style="width: 100%">
          <span
            class="black--text"
            :style="{
              fontSize:
                $vuetify.breakpoint.xs || $vuetify.breakpoint.sm
                  ? '15px'
                  : '20px'
            }"
          >
            {{ title }}
          </span>
        </div>
      </v-card-title>
      <v-card-text>
        <div class="text-center">
          <slot />
        </div>
        <v-row justify="center">
          <v-col cols="auto">
            <v-btn @click="no" class="mr-5" color="error">
              {{ $t("no") }}
            </v-btn>
            <v-btn @click="yes" color="success"> {{ $t("yes") }} </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "confirmation-dialog",
  components: {},
  props: {
    maxHeight: String,
    title: {
      type: String,
      default: "Title"
    },
    value: Boolean
  },
  data: () => ({
    open: false
  }),
  watch: {
    value(val) {
      this.open = val;
    }
  },
  methods: {
    yes() {
      this.$emit("yes");
      this.close();
    },
    no() {
      this.$emit("no");
    },
    close() {
      this.open = false;
      this.$emit("input", this.open);
    }
  }
};
</script>
