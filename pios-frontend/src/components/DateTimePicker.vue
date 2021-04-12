<template>
  <v-menu
    ref="display"
    v-model="display"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290"
    min-width="290"
  >
    <template #activator="{ on }">
      <v-text-field
        v-bind="textFieldProps"
        :disabled="disabled"
        :loading="loading"
        :name="name"
        :label="label"
        :value="dateTimeFormatted"
        :error-messages="errorMessages"
        v-on="on"
        readonly
      >
        <template #progress>
          <slot name="progress">
            <v-progress-linear
              color="primary"
              indeterminate
              absolute
              height="2"
            />
          </slot>
        </template>
        <template #label>
          <required-icon v-show="required" />
          <span>{{ label }}</span>
        </template>
      </v-text-field>
    </template>
    <date-time-tab
      v-model="dateTime"
      :datePickerProps="datePickerProps"
      :timePickerProps="timePickerProps"
      @change="dateTimePickerChanged"
    />
  </v-menu>
</template>

<script>
import DateTimeTab from "./DateTimeTab.vue";

export default {
  name: "date-time-picker",
  components: {
    DateTimeTab
  },
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: {
      type: [Date, String],
      default: null
    },
    disabled: {
      type: Boolean
    },
    loading: {
      type: Boolean
    },
    required: {
      type: Boolean
    },
    label: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    errorMessages: {
      type: Array,
      default: Array
    },
    textFieldProps: {
      type: Object
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
      display: false,
      activeTab: 0,
      date: null,
      time: null,
      dateTime: null
    };
  },
  created() {
    this.dateTime = this.value;
    if (!this.dateTime) {
      return;
    }
    this.date = this.dateTime.substr(0, 10);
    this.time = this.$options.filters.formatTime(this.dateTime);
  },
  computed: {
    dateTimeFormatted() {
      return this.dateTime == null
        ? null
        : this.$options.filters.formatDateTime(this.dateTime);
    }
  },
  methods: {
    dateTimePickerChanged(value) {
      this.display = false;
      this.dateTime = value;
      this.$emit("input", this.dateTimeFormatted);
    }
  }
};
</script>
