<template>
  <v-row>
    <v-col cols="12">
      <v-card :loading="loading" class="rounded-t-lg elevation-2">
        <template v-if="memberships.length != 0">
          <v-card-title>
            <v-icon
              class="mr-2"
              v-text="validMembership ? 'mdi-check-circle' : 'mdi-close-circle'"
              :color="validMembership ? 'green' : 'red'"
            />
            <span>
              {{
                validMembership
                  ? $t("membershipValid")
                  : $t("membershipInvalid")
              }}
            </span>
          </v-card-title>
          <v-card-subtitle v-if="validMembership">
            {{
              `${format(
                new Date(memberships[0].purchasedAt),
                "dd.MM.yyyy. HH:mm"
              )} - ${format(
                calculateExpiresAtDate(
                  memberships[0].purchasedAt,
                  memberships[0].duration
                ),
                "dd.MM.yyyy. HH:mm"
              )}`
            }}
          </v-card-subtitle>
        </template>
        <template v-else>
          <v-card-title>
            <v-icon class="mr-2" color="red">mdi-close-circle</v-icon>
            {{ $t("noMembershipsFound") }}
          </v-card-title>
        </template>
        <v-divider />
        <v-card-actions class="justify-center justify-md-end py-4">
          <v-btn
            @click="payDialog = true"
            :disabled="validMembership"
            color="primary"
            small
          >
            {{ $t("extendMembership") }}
          </v-btn>
          <v-btn
            @click="dialog = true"
            :disabled="!validMembership"
            color="error"
            small
          >
            {{ $t("cancelMembership") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" class="text-subtitle-2">
      {{ $t("previousMembershipPurchases") }}
    </v-col>
    <v-col cols="12" class="pt-0">
      <membership-table :loading="loading" :items="memberships" />
    </v-col>
    <confirmation-dialog
      @no="dialog = false"
      @yes="cancelMembership"
      v-model="dialog"
      :title="$t('areYouSure') + '?'"
    />
    <header-dialog
      max-width="50%"
      v-model="payDialog"
      :title="$t('extendMembership')"
      @close="resetPayDialog"
    >
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(extendMembership)">
          <v-row class="mt-1">
            <v-col cols="12">
              <validation-provider
                vid="membershipDuration"
                :name="$t('membershipDuration')"
                rules="required"
                v-slot="{ errors, valid, untouched, required, failed }"
              >
                <v-select
                  :error-messages="errors"
                  :hide-details="valid || (untouched && !failed)"
                  dense
                  item-text="text"
                  item-value="value"
                  return-object
                  :items="membershipDurationItems"
                  v-model="membershipDuration"
                  clearable
                >
                  <template #label>
                    <required-icon v-show="required" />
                    <span>{{ $t("membershipDuration") }}</span>
                  </template>
                </v-select>
              </validation-provider>
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                hide-details
                :disabled="!membershipDuration"
                :label="$t('amount')"
                readonly
                suffix="HRK"
                :value="membershipDurationAmount"
              />
            </v-col>
            <v-col cols="12" class="text-center text-md-right mt-2">
              <v-btn
                :loading="payLoading"
                :disabled="payLoading"
                small
                type="submit"
                color="primary"
              >
                {{ $t("pay") }}
              </v-btn>
            </v-col>
          </v-row>
        </form>
      </validation-observer>
    </header-dialog>
  </v-row>
</template>

<script>
import { format } from "date-fns";
import { PURCHASE_TYPE, MEMBERSHIP_DURATION } from "../constants/enumerations";
import {
  selectItemArrayFromEnum,
  calculateExpiresAtDate
} from "../helpers/index";
import ConfirmationDialog from "../components/ConfirmationDialog";
import HeaderDialog from "../components/HeaderDialog";
import MembershipService from "../services/membershipService";
import UserMixin from "../mixins/userMixin";
import MembershipMixin from "../mixins/membershipMixin";
import MembershipTable from "../components/MembershipTable.vue";

export default {
  name: "Membership",
  components: {
    ConfirmationDialog,
    HeaderDialog,
    MembershipTable
  },
  mixins: [UserMixin, MembershipMixin],
  created() {
    this.getData();
  },
  methods: {
    format,
    calculateExpiresAtDate,
    async getData() {
      this.loading = true;
      const response = await MembershipService.getAllMembershipsOfUser(
        this.user.id
      );
      if (response.status >= 400) {
        this.setMemberships([]);
      } else {
        const {
          data: { data }
        } = response;
        this.setMemberships(data);
      }
      this.loading = false;
    },
    resetPayDialog() {
      this.membershipDuration = null;
      this.$refs.observer.reset();
      this.payDialog = false;
    },
    async cancelMembership() {
      await MembershipService.deleteMembershipById(this.memberships[0].id);
      this.$emit("show-snackbar", {
        color: "success",
        message: this.$t("successfullyCancelledMembership")
      });
      this.dialog = false;
      this.getData();
    },
    async extendMembership() {
      this.payLoading = true;

      await MembershipService.createMembership({
        amount: this.formatMembershipDurationAmount(
          this.membershipDuration.val
        ),
        duration: this.membershipDuration.val,
        purchaseType: PURCHASE_TYPE.ONLINE,
        purchasedAt: new Date()
      });

      this.$emit("show-snackbar", {
        color: "success",
        message: this.$t("successfullyExtendedMembership")
      });

      this.resetPayDialog();
      this.getData();
    },
    formatMembershipDurationAmount(membershipDuration) {
      switch (membershipDuration) {
        case MEMBERSHIP_DURATION.MONTH:
          return 250;
        case MEMBERSHIP_DURATION.HALF_YEAR:
          return 1000;
        case MEMBERSHIP_DURATION.YEAR:
          return 2500;
        default:
          return 0;
      }
    }
  },
  computed: {
    membershipDurationAmount() {
      if (this.membershipDuration) {
        return this.formatMembershipDurationAmount(this.membershipDuration.val);
      }
      return 0;
    },
    membershipDurationItems() {
      return selectItemArrayFromEnum(
        "membershipDurationVals",
        MEMBERSHIP_DURATION
      );
    }
  },
  data: () => ({
    loading: false,
    PURCHASE_TYPE,
    MEMBERSHIP_DURATION,
    dialog: false,
    payDialog: false,
    payLoading: false,
    membershipDuration: null
  })
};
</script>
