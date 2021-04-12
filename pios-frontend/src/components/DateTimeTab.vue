<template>
  <v-tabs fixed-tabs v-model="activeTab">
    <v-tab key="calendar">
      <slot name="dateIcon">
        <v-icon>mdi-calendar</v-icon>
      </slot>
    </v-tab>
    <v-tab key="timer" :disabled="!date">
      <slot name="timeIcon">
        <v-icon>mdi-clock-outline</v-icon>
      </slot>
    </v-tab>
    <v-tab-item key="calendar">
      <v-date-picker
        v-model="date"
        v-bind="datePickerProps"
        full-width
        first-day-of-week="1"
        @input="showTimePicker"
      />
    </v-tab-item>
    <v-tab-item key="timer">
      <v-time-picker
        ref="time"
        v-model="time"
        v-bind="timePickerProps"
        full-width
        ampm-in-title
        @change="timePickerChanged"
      />
    </v-tab-item>
  </v-tabs>
</template>

<script>
export default {
  name: "date-time-tab",
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: {
      type: [Date, String],
      default: null
    },
    datePickerProps: {
      type: Object
    },
    timePickerProps: {
      type: Object
    }
  },
  data() {
    return {
      activeTab: 0,
      date: null,
      time: null
    };
  },
  created() {
    if (!this.value) {
      return;
    }
    this.date = this.value.substr(0, 10);
    this.time = this.$options.filters.formatTime(this.value);
  },
  methods: {
    resetPicker() {
      this.activeTab = 0;
      if (this.$refs.time) {
        this.$refs.time.selectingHour = true;
      }
    },
    showTimePicker() {
      this.activeTab = 1;
    },
    timePickerChanged() {
      this.resetPicker();
      this.$emit("change", this.date + " " + this.time);
    }
  }
};
</script>
