<template>
  <v-row>
    <v-col cols="12">
      <v-card class="rounded-t-lg elevation-2">
        <v-card-title>
          <v-icon
            class="mr-2"
            v-text="isMembershipValid ? 'mdi-check-circle' : 'mdi-close-circle'"
            :color="isMembershipValid ? 'green' : 'red'"
          />
          <span>
            {{
              isMembershipValid
                ? $t("membershipValid")
                : $t("membershipInvalid")
            }}
          </span>
        </v-card-title>
        <v-card-subtitle>
          {{
            `${format(items[0].purchasedAt, "dd.MM.yyyy. HH:mm")} - ${format(
              calculateExpiresAtDate(
                items[0].purchasedAt,
                items[0].membershipDuration
              ),
              "dd.MM.yyyy. HH:mm"
            )}`
          }}
        </v-card-subtitle>
        <v-divider />
        <v-card-actions class="justify-center justify-md-end py-4">
          <v-btn
            @click="payDialog = true"
            :disabled="!isMembershipValid"
            color="primary"
            small
          >
            Extend
          </v-btn>
          <v-btn
            @click="dialog = true"
            :disabled="!isMembershipValid"
            color="error"
            small
          >
            Cancel
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
        :items="items"
        :items-per-page="5"
        class="elevation-2"
      >
        <template #item.purchasedAt="{ item }">
          {{ format(item.purchasedAt, "dd.MM.yyyy. HH:mm") }}
        </template>
        <template #item.expiresAt="{ item }">
          {{
            format(
              calculateExpiresAtDate(item.purchasedAt, item.membershipDuration),
              "dd.MM.yyyy. HH:mm"
            )
          }}
        </template>
        <template #item.typeOfPurchase="{ item }">
          {{
            $t(`typeOfPurchase.${getKeyByValue(PAY_TYPE, item.typeOfPurchase)}`)
          }}
        </template>
        <template #item.membershipDuration="{ item }">
          {{
            $t(
              `membershipDurationVals.${getKeyByValue(
                MEMBERSHIP_DURATION,
                item.membershipDuration
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
      title="Are you sure?"
    />
    <header-dialog
      max-width="50%"
      v-model="payDialog"
      title="Extend membership"
      @close="resetPayDialog"
    >
      <validation-observer ref="observer">
        <form @submit.prevent="login">
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
import { add, format, isBefore } from "date-fns";
import { PAY_TYPE, MEMBERSHIP_DURATION } from "../constants/enumerations";
import {
  getKeyByValue,
  download,
  dataUrlToFile,
  selectItemArrayFromEnum
} from "../helpers/index";
import { dummyPdfBase64 } from "../constants/index";
import ConfirmationDialog from "../components/ConfirmationDialog";
import HeaderDialog from "../components/HeaderDialog";

export default {
  name: "Membership",
  components: {
    ConfirmationDialog,
    HeaderDialog
  },
  methods: {
    add,
    format,
    getKeyByValue,
    resetPayDialog() {
      this.membershipDuration = null;
      this.$refs.observer.reset();
    },
    calculateExpiresAtDate(date, membershipDuration) {
      switch (membershipDuration) {
        case MEMBERSHIP_DURATION.MONTH:
          return add(date, { months: 1 });
        case MEMBERSHIP_DURATION.HALF_YEAR:
          return add(date, { months: 6 });
        case MEMBERSHIP_DURATION.YEAR:
          return add(date, { years: 1 });
      }
    },
    async downloadReceipt() {
      const file = await dataUrlToFile(
        `data:application/pdf;base64,${dummyPdfBase64}`,
        "receipt.pdf",
        "application/pdf"
      );
      download(file);
    },
    cancelMembership() {
      // Cancel membership call here
      this.dialog = false;
    }
  },
  computed: {
    membershipDurationAmount() {
      if (this.membershipDuration) {
        switch (this.membershipDuration.val) {
          case MEMBERSHIP_DURATION.MONTH:
            return 250;
          case MEMBERSHIP_DURATION.HALF_YEAR:
            return 1000;
          case MEMBERSHIP_DURATION.YEAR:
            return 2500;
        }
      }
      return null;
    },
    isMembershipValid() {
      if (this.items && this.items.length != 0) {
        return isBefore(
          new Date(),
          new Date(
            this.calculateExpiresAtDate(
              this.items[0].purchasedAt,
              this.items[0].membershipDuration
            )
          )
        );
      }
      return false;
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
          value: "membershipDuration"
        },
        {
          text: this.$t("typeOfPurchaseHeader"),
          value: "typeOfPurchase",
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
    PAY_TYPE,
    MEMBERSHIP_DURATION,
    dialog: false,
    payDialog: false,
    payLoading: false,
    membershipDuration: null,
    items: [
      {
        purchasedAt: new Date(),
        typeOfPurchase: PAY_TYPE.CASH,
        membershipDuration: MEMBERSHIP_DURATION.MONTH,
        amount: 250
      },
      {
        purchasedAt: new Date(1612300931 * 1000),
        membershipDuration: MEMBERSHIP_DURATION.MONTH,
        typeOfPurchase: PAY_TYPE.CASH,
        amount: 250
      },
      {
        purchasedAt: new Date(1609536131 * 1000),
        membershipDuration: MEMBERSHIP_DURATION.MONTH,
        typeOfPurchase: PAY_TYPE.ONLINE,
        amount: 175
      },
      {
        purchasedAt: new Date(1591129331 * 1000),
        membershipDuration: MEMBERSHIP_DURATION.MONTH,
        typeOfPurchase: PAY_TYPE.CREDIT_CARD,
        amount: 250
      },
      {
        purchasedAt: new Date(1332021453 * 1000),
        membershipDuration: MEMBERSHIP_DURATION.YEAR,
        typeOfPurchase: PAY_TYPE.CREDIT_CARD,
        amount: 2500
      }
    ]
  })
};
</script>
