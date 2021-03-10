<template>
  <v-row class="mt-1">
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
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { add, format } from "date-fns";
import { PAY_TYPE } from "../constants/enumerations";
import { getKeyByValue } from "../helpers/index";

export default {
  name: "Membership",
  methods: {
    format,
    getKeyByValue
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
      }
    ],
    desserts: [
      {
        purchasedAt: new Date(),
        expiredAt: add(new Date(), { days: 4 }),
        typeOfPurchase: PAY_TYPE.ONLINE
      },
      {
        purchasedAt: new Date(),
        expiredAt: add(new Date(), { days: 4 }),
        typeOfPurchase: PAY_TYPE.CASH
      },
      {
        purchasedAt: new Date(),
        expiredAt: add(new Date(), { days: 4 }),
        typeOfPurchase: PAY_TYPE.CREDIT_CARD
      },
      {
        purchasedAt: new Date(),
        expiredAt: add(new Date(), { days: 4 }),
        typeOfPurchase: PAY_TYPE.CASH
      },
      {
        purchasedAt: new Date(),
        expiredAt: add(new Date(), { days: 4 }),
        typeOfPurchase: PAY_TYPE.CASH
      },
      {
        purchasedAt: new Date(),
        expiredAt: add(new Date(), { days: 4 }),
        typeOfPurchase: PAY_TYPE.ONLINE
      }
    ]
  })
};
</script>
