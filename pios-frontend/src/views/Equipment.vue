<template>
  <v-row class="mt-0">
    <v-col cols="12">
      <v-row>
        <v-col cols="6">
          <v-text-field
            @change="search"
            outlined
            hide-details
            :label="$t('name')"
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
            :label="$t('equipmentType')"
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
            :label="$t('showOnlyMyEquipment')"
          />
        </v-col>
        <v-col cols="12" v-else class="text-right">
          <v-btn
            color="primary"
            small
            class="mr-3"
            @click="newEquipmentTypeDialog = true"
          >
            {{ $t("newEquipmentType") }}
          </v-btn>
          <v-btn color="success" small @click="newEquipmentDialog = true">
            {{ $t("newEquipment") }}
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
              {{ $t("available") }}
            </template>
            <template v-else>
              <v-icon color="red" class="mt-n1" small>
                mdi-close-circle
              </v-icon>
              {{ $t('inUseBy') }}: <span class="font-weight-bold">{{ eq.userName }}</span>
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
              {{ $t("reserve") }}
            </v-btn>
            <v-btn
              :disabled="eq.userId != user.id || eq.userId == null"
              small
              color="error"
            >
              {{ $t("removeReservation") }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </template>
    <header-dialog
      max-width="50%"
      v-model="newEquipmentTypeDialog"
      :title="$t('newEquipmentType')"
      @close="resetNewEquipmentTypeDialog"
    >
      <validation-observer ref="newEquipmentTypeForm">
        <form @submit.prevent="addNewEquipmentType">
          <v-row class="mt-1">
            <v-col cols="12">
              <validation-provider
                vid="newEquipmentTypeName"
                :name="$t('newEquipmentTypeName')"
                rules="required"
                v-slot="{ errors, valid, untouched, required, failed }"
              >
                <v-text-field
                  v-model="newEquipmentTypeName"
                  :error-messages="errors"
                  :hide-details="valid || (untouched && !failed)"
                  dense
                >
                  <template #label>
                    <required-icon v-show="required" />
                    <span>{{ $t("newEquipmentTypeName") }}</span>
                  </template>
                </v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12" class="text-center text-md-right mt-2">
              <v-btn
                :loading="newEquipmentTypeLoading"
                :disabled="newEquipmentTypeLoading"
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
    <header-dialog
      max-width="50%"
      v-model="newEquipmentDialog"
      :title="$t('newEquipment')"
      @close="resetNewEquipmentDialog"
    >
      <validation-observer ref="newEquipmentForm">
        <form @submit.prevent="addNewEquipment">
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
                  item-text="text"
                  item-value="value"
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
import debounce from "debounce";
import UserMixin from "../mixins/userMixin";
import HeaderDialog from "../components/HeaderDialog";

export default {
  name: "Equipment",
  mixins: [UserMixin],
  components: {
    HeaderDialog
  },
  methods: {
    search: debounce(async function() {
      // Search equipment here
    }, 750),
    addNewEquipment() {
      //
    },
    addNewEquipmentType() {
      //
    },
    resetNewEquipmentDialog() {
      this.newEquipment.type = null;
      this.newEquipment.name = null;
      this.$refs.newEquipmentForm.reset();
    },
    resetNewEquipmentTypeDialog() {
      this.newEquipmentTypeName = null;
      this.$refs.newEquipmentTypeForm.reset();
    }
  },
  data: () => ({
    newEquipment: {
      type: null,
      name: null
    },
    newEquipmentTypeName: null,
    newEquipmentLoading: false,
    newEquipmentTypeLoading: false,
    newEquipmentDialog: false,
    newEquipmentTypeDialog: false,
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
