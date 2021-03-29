<template>
  <v-data-table
    dense
    :headers="headers"
    :items="items"
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
        $t(`typeOfPurchase.${getKeyByValue(PURCHASE_TYPE, item.purchaseType)}`)
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
</template>

<script>
import { add, format } from "date-fns";
import { PURCHASE_TYPE, MEMBERSHIP_DURATION } from "../constants/enumerations";
import {
  calculateExpiresAtDate,
  download,
  dataUrlToFile,
  getKeyByValue
} from "../helpers/index";
import { dummyPdfBase64 } from "../constants/index";

export default {
  name: "membership-table",
  props: {
    items: Array
  },
  methods: {
    add,
    format,
    calculateExpiresAtDate,
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
  data: () => ({
    PURCHASE_TYPE,
    MEMBERSHIP_DURATION
  }),
  computed: {
    headers() {
      return [
        {
          text: this.$t("purchasedAt"),
          value: "purchasedAt",
          sortable: false
        },
        {
          text: this.$t("expiresAt"),
          value: "expiresAt",
          sortable: false
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
          value: "amount",
          sortable: false
        },
        {
          text: null,
          value: "actions",
          sortable: false
        }
      ];
    }
  }
};
</script>
