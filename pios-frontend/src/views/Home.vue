<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4">
      <v-menu :close-on-content-click="false" content-class="elevation-2">
        <template #activator="{ on, attrs }">
          <v-btn
            fab
            depressed
            x-small
            color="primary"
            class="top-absolute"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-group>
            <template #activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t("displayType") }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>{{ $t("day") }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>{{ $t("week") }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>{{ $t("month") }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-item v-if="!isAdmin">
            <v-list-item-title>{{ $t("newReservation") }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="setToday">
            <v-list-item-title>{{ $t("today") }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon color="grey darken-2" @click="prev">
        <v-icon>
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <span class="px-3 font-weight-bold" v-if="$refs.calendar">
        {{ $refs.calendar.title }}
      </span>
      <v-btn icon color="grey darken-2" @click="next">
        <v-icon>
          mdi-chevron-right
        </v-icon>
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        />
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card :color="darkMode && 'grey lighten-4'" min-width="250px" flat>
            <v-toolbar :color="selectedEvent.color">
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name" />
              <v-spacer />
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details" />
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import DarkModeMixin from "../mixins/darkModeMixin";
import UserMixin from "../mixins/userMixin";

export default {
  name: "Home",
  mixins: [DarkModeMixin, UserMixin],
  computed: {
    typeToLabel() {
      return {
        month: this.$t("month"),
        week: this.$t("week"),
        day: this.$t("day")
      };
    }
  },
  data: () => ({
    fab: false,
    focus: "",
    type: "month",
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1"
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party"
    ]
  }),
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];
      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);
      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);
        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay
        });
      }
      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    }
  }
};
</script>
