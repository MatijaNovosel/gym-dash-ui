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
          <span>{{ isMembershipValid ? $t("membershipValid") : $t("membershipInvalid") }}</span>
        </v-card-title>
        <v-card-subtitle>
          {{
            `${format(items[0].purchasedAt, "dd.MM.yyyy. HH:mm")} - ${format(
              items[0].expiredAt,
              "dd.MM.yyyy. HH:mm"
            )}`
          }}
        </v-card-subtitle>
        <v-divider />
        <v-card-actions class="justify-end py-4">
          <v-btn :disabled="isMembershipValid" color="primary" small>Extend membership</v-btn>
          <v-btn :disabled="!isMembershipValid" color="error" small>Cancel membership</v-btn>
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
        <template #item.expiredAt="{ item }">
          {{ format(item.expiredAt, "dd.MM.yyyy. HH:mm") }}
        </template>
        <template #item.typeOfPurchase="{ item }">
          {{
            $t(`typeOfPurchase.${getKeyByValue(PAY_TYPE, item.typeOfPurchase)}`)
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
  </v-row>
</template>

<script>
import { add, format, isBefore } from "date-fns";
import { PAY_TYPE } from "../constants/enumerations";
import { getKeyByValue, download, dataUrlToFile } from "../helpers/index";
import { dummyPdfBase64 } from "../constants/index";

export default {
  name: "Membership",
  methods: {
    format,
    getKeyByValue,
    async downloadReceipt() {
      const file = await dataUrlToFile(
        `data:application/pdf;base64,${dummyPdfBase64}`,
        "receipt.pdf",
        "application/pdf"
      );
      download(file);
    }
  },
  computed: {
    isMembershipValid() {
      if (this.items && this.items.length != 0) {
        return isBefore(new Date(), new Date(this.items[0].expiredAt * 1000));
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
          text: this.$t("expiredAt"),
          value: "expiredAt"
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
    }
  },
  data: () => ({
    PAY_TYPE,
    items: [
      {
        purchasedAt: new Date(),
        expiredAt: add(new Date(), { days: 30 }),
        typeOfPurchase: PAY_TYPE.CASH,
        amount: 25
      },
      {
        purchasedAt: new Date(1612300931 * 1000),
        expiredAt: add(new Date(1612300931 * 1000), { days: 30 }),
        typeOfPurchase: PAY_TYPE.CASH,
        amount: 43
      },
      {
        purchasedAt: new Date(1609536131 * 1000),
        expiredAt: add(new Date(1609536131 * 1000), { days: 30 }),
        typeOfPurchase: PAY_TYPE.ONLINE,
        amount: 240
      },
      {
        purchasedAt: new Date(1591129331 * 1000),
        expiredAt: add(new Date(1591129331 * 1000), { days: 30 }),
        typeOfPurchase: PAY_TYPE.CREDIT_CARD,
        amount: 125
      },
      {
        purchasedAt: new Date(1580678531 * 1000),
        expiredAt: add(new Date(1580678531 * 1000), { days: 30 }),
        typeOfPurchase: PAY_TYPE.CREDIT_CARD,
        amount: 100
      },
      {
        purchasedAt: new Date(1559928131 * 1000),
        expiredAt: add(new Date(1559928131 * 1000), { days: 30 }),
        typeOfPurchase: PAY_TYPE.CREDIT_CARD,
        amount: 400
      }
    ]
  })
};
</script>
