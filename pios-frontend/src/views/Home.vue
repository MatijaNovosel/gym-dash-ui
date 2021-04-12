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
          <v-list-item @click="setToday">
            <v-list-item-title>{{ $t("today") }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="newReservation"
            v-if="!isAdmin"
            :disabled="!validMembership"
          >
            <v-list-item-title>{{ $t("newReservation") }}</v-list-item-title>
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
        />
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
          content-class="elevation-1 rounded-lg"
        >
          <v-card min-width="250px">
            <v-card-title>
              {{ selectedEvent.name }}
            </v-card-title>
            <v-card-subtitle>
              {{ selectedEvent.start }} - {{ selectedEvent.end }}
            </v-card-subtitle>
            <v-divider />
            <v-card-actions class="justify-center justify-md-end py-4">
              <v-btn small color="error" @click="selectedOpen = false">
                Delete reservation
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
    <header-dialog
      max-width="50%"
      v-model="newReservationDialog"
      :title="$t('newReservation')"
      @close="resetNewReservationDialog"
    >
      <validation-observer ref="newReservationForm" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(addNewEquipment)">
          <v-row class="mt-1">
            <v-col cols="12">
              <validation-provider
                vid="newEquipmentType"
                :name="$t('equipmentType')"
                rules="required"
                v-slot="{ errors, valid, untouched, required, failed }"
              >
                <v-select
                  :error-messages="errors"
                  :hide-details="valid || (untouched && !failed)"
                  dense
                  item-text="name"
                  item-value="id"
                  return-object
                  :items="equipmentTypes"
                  v-model="newEquipment.type"
                  clearable
                >
                  <template #label>
                    <required-icon v-show="required" />
                    <span>{{ $t("equipmentType") }}</span>
                  </template>
                </v-select>
              </validation-provider>
            </v-col>
            <v-col cols="12">
              <validation-provider
                vid="newEquipmentName"
                :name="$t('equipmentName')"
                rules="required"
                v-slot="{ errors, valid, untouched, required, failed }"
              >
                <v-text-field
                  v-model="newEquipment.name"
                  :error-messages="errors"
                  :hide-details="valid || (untouched && !failed)"
                  dense
                >
                  <template #label>
                    <required-icon v-show="required" />
                    <span>{{ $t("equipmentName") }}</span>
                  </template>
                </v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12" class="text-center text-md-right mt-2">
              <v-btn
                :loading="newEquipmentLoading"
                :disabled="newEquipmentLoading"
                small
                type="submit"
                color="primary"
              >
                {{ $t("create") }}
              </v-btn>
            </v-col>
          </v-row>
        </form>
      </validation-observer>
    </header-dialog>
  </v-row>
</template>

<script>
import DarkModeMixin from "../mixins/darkModeMixin";
import UserMixin from "../mixins/userMixin";
import MembershipMixin from "../mixins/membershipMixin";
import HeaderDialog from "../components/HeaderDialog";
import ReservationService from "../services/reservationService";

export default {
  name: "Home",
  mixins: [DarkModeMixin, UserMixin, MembershipMixin],
  components: {
    HeaderDialog
  },
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
    newReservationDialog: false,
    fab: false,
    focus: "",
    type: "month",
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
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
    this.getData();
  },
  methods: {
    async getData() {
      /*

        {
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay
        }

      */
      const {
        data: { data }
      } = await ReservationService.getAllReservations();
      this.events = data.map((reservation) => ({
        name: reservation.description,
        start: reservation.from,
        end: reservation.to,
        color: "orange",
        timed: true
      }));
    },
    resetNewReservationDialog() {
      this.newReservation.description = null;
      this.newReservation.from = null;
      this.newReservation.to = null;
      this.$refs.newReservationForm.reset();
      this.newReservationDialog = false;
    },
    newReservation() {
      this.newReservationDialog = true;
    },
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
    }
  }
};
</script>
