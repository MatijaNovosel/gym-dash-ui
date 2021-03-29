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
          <v-card-subtitle>
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
      <v-data-table
        dense
        :headers="headers"
        :items="memberships"
        :items-per-page="5"
        class="elevation-2"
      >
        <template #item.purchasedAt="{ item }">
          {{ format(new Date(item.purchasedAt), "dd.MM.yyyy. HH:mm") }}
        </template>
        <template #item.expiresAt="{ item }">
          {{
            format(
              calculateExpiresAtDate(item.purchasedAt, item.duration),
              "dd.MM.yyyy. HH:mm"
            )
          }}
        </template>
        <template #item.purchaseType="{ item }">
          {{
            $t(
              `typeOfPurchase.${getKeyByValue(
                PURCHASE_TYPE,
                item.purchaseType
              )}`
            )
          }}
        </template>
        <template #item.duration="{ item }">
          {{
            $t(
              `membershipDurationVals.${getKeyByValue(
                MEMBERSHIP_DURATION,
                item.duration
              )}`
            )
          }}
        </template>
        <template #item.amount="{ item }">
          {{ item.amount }}
          HRK
        </template>
        <template #item.actions>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                color="red"
                v-on="on"
                v-bind="attrs"
                @click="downloadReceipt"
              >
                <v-icon>mdi-file-pdf</v-icon>
              </v-btn>
            </template>
            {{ $t("viewReceipt") }}
          </v-tooltip>
        </template>
      </v-data-table>
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
      <validation-observer ref="observer">
        <form @submit.prevent="extendMembership">
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
import { add, format } from "date-fns";
import { PURCHASE_TYPE, MEMBERSHIP_DURATION } from "../constants/enumerations";
import {
  getKeyByValue,
  download,
  dataUrlToFile,
  selectItemArrayFromEnum,
  calculateExpiresAtDate
} from "../helpers/index";
import { dummyPdfBase64 } from "../constants/index";
import ConfirmationDialog from "../components/ConfirmationDialog";
import HeaderDialog from "../components/HeaderDialog";
import MembershipService from "../services/membershipService";
import UserMixin from "../mixins/userMixin";
import MembershipMixin from "../mixins/membershipMixin";

export default {
  name: "Membership",
  components: {
    ConfirmationDialog,
    HeaderDialog
  },
  mixins: [UserMixin, MembershipMixin],
  methods: {
    add,
    format,
    getKeyByValue,
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
    },
    async downloadReceipt() {
      const file = await dataUrlToFile(
        `data:application/pdf;base64,${dummyPdfBase64}`,
        "receipt.pdf",
        "application/pdf"
      );
      download(file);
    },
    async cancelMembership() {
      await MembershipService.deleteMembershipById(this.memberships[0].id);
      this.$emit("show-snackbar", {
        color: "success",
        message: this.$t("successfullyCancelledMembership")
      });
      this.getData();
      this.dialog = false;
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

      this.payLoading = false;

      this.getData();
      this.payDialog = false;
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
    headers() {
      return [
        {
          text: this.$t("purchasedAt"),
          value: "purchasedAt"
        },
        {
          text: this.$t("expiresAt"),
          value: "expiresAt"
        },
        {
          text: this.$t("membershipDuration"),
          value: "duration",
          sortable: false
        },
        {
          text: this.$t("typeOfPurchaseHeader"),
          value: "purchaseType",
          sortable: false
        },
        {
          text: this.$t("amount"),
          value: "amount"
        },
        {
          text: null,
          value: "actions",
          sortable: false
        }
      ];
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
