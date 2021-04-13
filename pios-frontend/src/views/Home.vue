<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4">
      <v-btn icon color="grey darken-2" @click="prev">
        <v-icon>
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <span class="px-3 font-weight-bold" v-if="$refs.calendar">
        {{ capitalize($refs.calendar.title) }}
      </span>
      <v-btn icon color="grey darken-2" @click="next">
        <v-icon>
          mdi-chevron-right
        </v-icon>
      </v-btn>
      <v-menu :close-on-content-click="false" content-class="elevation-2">
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-group>
            <template #activator>
              <v-icon small class="pr-3">mdi-calendar</v-icon>
              <v-list-item-title>
                {{ $t("displayType") }}
              </v-list-item-title>
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
            <v-icon small class="pr-3">mdi-calendar-plus</v-icon>
            <v-list-item-title>{{ $t("today") }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="openNewReservationDialog"
            v-if="!isAdmin"
            :disabled="!validMembership"
          >
            <v-icon small class="pr-3">mdi-plus</v-icon>
            <v-list-item-title>{{ $t("newReservation") }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
    <v-col cols="12">
      <v-sheet height="600">
        <v-calendar
          :locale="locale"
          event-overlap-mode="stack"
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="reservations"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
        >
        </v-calendar>
        <v-menu
          v-if="selectedElement"
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
          content-class="elevation-1 rounded-lg"
          :min-width="width"
        >
          <v-card>
            <v-card-title>
              <span>{{ selectedEvent.username }}</span>
              <span class="px-1">-</span>
              <span class="grey--text">{{ selectedEvent.name }}</span>
            </v-card-title>
            <v-card-subtitle>
              {{
                format(
                  parse(selectedEvent.start, "yyyy-MM-dd HH:mm", new Date()),
                  "dd.MM.yyyy. HH:mm"
                )
              }}
              -
              {{
                format(
                  parse(selectedEvent.end, "yyyy-MM-dd HH:mm", new Date()),
                  "dd.MM.yyyy. HH:mm"
                )
              }}
            </v-card-subtitle>
            <template v-if="user.id == selectedEvent.userId || isAdmin">
              <v-divider />
              <v-card-actions class="justify-center justify-md-end py-4">
                <v-btn
                  small
                  color="error"
                  @click="deleteReservation(selectedEvent.id)"
                >
                  Delete reservation
                </v-btn>
              </v-card-actions>
            </template>
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
        <form @submit.prevent="handleSubmit(addNewReservation)">
          <v-row class="mt-1">
            <v-col cols="12">
              <validation-provider
                vid="newReservationDescription"
                :name="$t('newReservationDescription')"
                rules="required"
                v-slot="{ errors, valid, untouched, required, failed }"
              >
                <v-text-field
                  id="newReservationDescription"
                  v-model="newReservation.description"
                  :error-messages="errors"
                  :hide-details="valid || (untouched && !failed)"
                  dense
                >
                  <template #label>
                    <required-icon v-show="required" />
                    <span>{{ $t("newReservationDescription") }}</span>
                  </template>
                </v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12">
              <validation-provider
                vid="newReservationFrom"
                :name="$t('from')"
                rules="required|dateMustBeBefore:@newReservationTo"
                v-slot="{ errors, valid, untouched, required, failed }"
              >
                <date-time-picker
                  :clear="clearPickers"
                  :label="$t('from')"
                  :required="required"
                  :error-messages="errors"
                  :text-field-props="{
                    dense: true,
                    id: 'from',
                    'prepend-icon': 'mdi-calendar',
                    'hide-details': valid || (untouched && !failed)
                  }"
                  v-model="newReservation.from"
                />
              </validation-provider>
            </v-col>
            <v-col cols="12">
              <validation-provider
                vid="newReservationTo"
                :name="$t('to')"
                rules="required|dateMustBeAfter:@newReservationFrom"
                v-slot="{ errors, valid, untouched, required, failed }"
              >
                <date-time-picker
                  :clear="clearPickers"
                  :label="$t('to')"
                  :required="required"
                  :error-messages="errors"
                  :text-field-props="{
                    dense: true,
                    id: 'to',
                    'prepend-icon': 'mdi-calendar',
                    'hide-details': valid || (untouched && !failed)
                  }"
                  v-model="newReservation.to"
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" class="text-center text-md-right mt-2">
              <v-btn
                :loading="newReservationLoading"
                :disabled="newReservationLoading"
                small
                type="submit"
                color="success"
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
import LoadingMixin from "../mixins/loadingMixin";
import { format, parse } from "date-fns";
import { capitalize } from "../helpers/index";
import LocaleMixin from "../mixins/localeMixin";
import DateTimePicker from "../components/DateTimePicker";

export default {
  name: "Home",
  mixins: [
    DarkModeMixin,
    UserMixin,
    MembershipMixin,
    LoadingMixin,
    LocaleMixin
  ],
  components: {
    HeaderDialog,
    DateTimePicker
  },
  computed: {
    typeToLabel() {
      return {
        month: this.$t("month"),
        week: this.$t("week"),
        day: this.$t("day")
      };
    },
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 300;
        case "sm":
          return 400;
        case "md":
          return 500;
        case "lg":
          return 600;
        case "xl":
          return 700;
        default:
          return 500;
      }
    }
  },
  data: () => ({
    clearPickers: false,
    newReservationLoading: false,
    newReservationDialog: false,
    newReservation: {
      description: null,
      from: null,
      to: null
    },
    fab: false,
    focus: "",
    type: "month",
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    reservations: []
  }),
  mounted() {
    this.getData();
  },
  methods: {
    capitalize,
    format,
    parse,
    async deleteReservation(id) {
      await ReservationService.deleteReservation(id);
      this.$emit("show-snackbar", {
        color: "success",
        message: this.$t("reservationDeleted")
      });
      this.selectedOpen = false;
      this.getData();
    },
    async addNewReservation() {
      this.newReservationLoading = true;
      await ReservationService.createReservation({
        description: this.newReservation.description,
        from: parse(this.newReservation.from, "dd.M.yyyy. HH:mm", new Date()),
        to: parse(this.newReservation.to, "dd.M.yyyy. HH:mm", new Date())
      });
      this.newReservationLoading = false;
      this.$emit("show-snackbar", {
        color: "success",
        message: this.$t("newReservationCreated")
      });
      this.resetNewReservationDialog();
      this.getData();
    },
    async getData() {
      this.setLoading(true);
      const {
        data: { data }
      } = await ReservationService.getAllReservations();
      this.reservations = data.map((reservation) => ({
        id: reservation.id,
        name: reservation.description,
        userId: reservation.user.id,
        start: format(new Date(reservation.from), "yyyy-MM-dd HH:mm"),
        end: format(new Date(reservation.to), "yyyy-MM-dd HH:mm"),
        color: "#000000".replace(/0/g, function() {
          return (~~(Math.random() * 16)).toString(16);
        }),
        username: reservation.user.username
      }));
      this.setLoading(false);
    },
    resetNewReservationDialog() {
      this.clearPickers = !this.clearPickers;
      this.newReservation.description = null;
      this.newReservation.from = null;
      this.newReservation.to = null;
      this.$refs.newReservationForm.reset();
      this.newReservationDialog = false;
    },
    openNewReservationDialog() {
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
