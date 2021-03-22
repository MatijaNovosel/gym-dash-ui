<template>
  <v-row class="mt-0">
    <v-col cols="12">
      <v-row>
        <v-col cols="6">
          <v-text-field
            @change="search"
            outlined
            hide-details
            label="Name"
            dense
            v-model="searchInput.name"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            @change="search"
            item-text="text"
            item-value="value"
            return-object
            outlined
            label="Type"
            hide-details
            multiple
            :items="equipmentTypes"
            dense
            v-model="searchInput.type"
          />
        </v-col>
        <v-col cols="12" v-if="!isAdmin">
          <v-switch
            @change="search"
            v-model="searchInput.onlyMyEquipment"
            inset
            hide-details
            label="Show only my equipment"
          />
        </v-col>
        <v-col cols="12" v-else class="text-right">
          <v-btn color="primary" small class="mr-3">
            New equipment type
          </v-btn>
          <v-btn color="success" small>
            New equipment
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <template v-for="eq in equipment">
      <v-col cols="12" md="3" :key="eq.id">
        <v-card outlined rounded="lg">
          <v-card-title>
            {{ eq.name }}
            <span class="grey--text text--darken-1 text-caption ml-1">
              ({{ eq.type }})
            </span>
          </v-card-title>
          <v-card-subtitle>
            <template v-if="eq.userId == null">
              <v-icon color="green" class="mt-n1" small>
                mdi-check-circle
              </v-icon>
              Available
            </template>
            <template v-else>
              <v-icon color="red" class="mt-n1" small>
                mdi-close-circle
              </v-icon>
              In use by: <span class="font-weight-bold">{{ eq.userName }}</span>
            </template>
          </v-card-subtitle>
          <v-divider />
          <v-card-text class="text-right">
            <v-btn
              v-if="!isAdmin"
              :disabled="
                eq.userId && (eq.userId == user.id || eq.userId != user.id)
              "
              small
              color="success"
              class="mr-2"
            >
              Reserve
            </v-btn>
            <v-btn
              :disabled="eq.userId != user.id || eq.userId == null"
              small
              color="error"
            >
              Remove
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import debounce from "debounce";
import UserMixin from "../mixins/userMixin";

export default {
  name: "Equipment",
  mixins: [UserMixin],
  methods: {
    search: debounce(async function() {
      // Search equipment here
    }, 750)
  },
  data: () => ({
    searching: false,
    equipment: [
      {
        name: "Dumbbell #1",
        type: "Dumbbell 5kg",
        typeId: 1,
        userId: 8,
        userName: "usercina"
      },
      {
        name: "Dumbbell #2",
        type: "Dumbbell 10kg",
        typeId: 2,
        userId: 5,
        userName: "user"
      },
      {
        name: "Dumbbell #3",
        type: "Dumbbell 15kg",
        typeId: 3,
        userId: null,
        userName: null
      },
      {
        name: "Dumbbell #4",
        type: "Dumbbell 20kg",
        typeId: 4,
        userId: null,
        userName: null
      },
      {
        name: "Dumbbell #5",
        type: "Dumbbell 25kg",
        typeId: 5,
        userId: null,
        userName: null
      }
    ],
    equipmentTypes: [
      {
        text: "Dumbbell 5kg",
        value: 1
      },
      {
        text: "Dumbbell 10kg",
        value: 2
      },
      {
        text: "Dumbbell 15kg",
        value: 3
      },
      {
        text: "Dumbbell 20kg",
        value: 4
      },
      {
        text: "Dumbbell 25kg",
        value: 5
      }
    ],
    searchInput: {
      name: null,
      type: null,
      onlyMyEquipment: false
    }
  })
};
</script>

<style scoped>
::v-deep .v-input--selection-controls {
  margin-top: 0px;
  padding-top: 4px;
}
</style>
