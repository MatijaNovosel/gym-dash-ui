<template>
  <v-row>
    <v-col cols="12">
      <v-card class="rounded-t-lg elevation-2">
        <v-card-title>
          <v-icon class="mr-2" color="green">mdi-check-circle</v-icon>
          <span>Membership is valid</span>
        </v-card-title>
        <v-card-subtitle>
          03.03.2021. - 05.06.2021.
        </v-card-subtitle>
      </v-card>
    </v-col>
    <v-col cols="12" class="text-subtitle-2">
      Previous membership purchases
    </v-col>
    <v-col cols="12" class="pt-0">
      <v-data-table
        dense
        :headers="headers"
        :items="desserts"
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
            View receipt
          </v-tooltip>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { add, format } from "date-fns";
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
  data: () => ({
    PAY_TYPE,
    headers: [
      {
        text: "Purchased at",
        value: "purchasedAt"
      },
      {
        text: "Expired at",
        value: "expiredAt"
      },
      {
        text: "Type of purchase",
        value: "typeOfPurchase"
      },
      {
        text: "Amount",
        value: "amount"
      },
      {
        text: "",
        value: "actions"
      }
    ],
    desserts: [
      {
        purchasedAt: new Date(),
        expiredAt: add(new Date(), { days: 4 }),
        typeOfPurchase: PAY_TYPE.ONLINE,
        amount: 125
      },
      {
        purchasedAt: new Date(),
        expiredAt: add(new Date(), { days: 4 }),
        typeOfPurchase: PAY_TYPE.CASH,
        amount: 225
      },
      {
        purchasedAt: new Date(),
        expiredAt: add(new Date(), { days: 4 }),
        typeOfPurchase: PAY_TYPE.CREDIT_CARD,
        amount: 111
      },
      {
        purchasedAt: new Date(),
        expiredAt: add(new Date(), { days: 4 }),
        typeOfPurchase: PAY_TYPE.CASH,
        amount: 65
      },
      {
        purchasedAt: new Date(),
        expiredAt: add(new Date(), { days: 4 }),
        typeOfPurchase: PAY_TYPE.CASH,
        amount: 43
      },
      {
        purchasedAt: new Date(),
        expiredAt: add(new Date(), { days: 4 }),
        typeOfPurchase: PAY_TYPE.ONLINE,
        amount: 999
      }
    ]
  })
};
</script>
