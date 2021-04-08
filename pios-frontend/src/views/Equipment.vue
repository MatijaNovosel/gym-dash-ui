<template>
  <v-row class="mt-0">
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            @input="search"
            outlined
            hide-details
            :label="$t('name')"
            dense
            v-model="searchInput.name"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            @input="search"
            item-text="name"
            item-value="id"
            :return-object="false"
            outlined
            :label="$t('equipmentType')"
            hide-details
            :items="equipmentTypes"
            :loading="equipmentTypesLoading"
            :disabled="equipmentTypesLoading"
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
    <v-col cols="12" class="text-center text-h5" v-if="equipment.length == 0">
      <v-icon color="red" class="mr-2">mdi-alert</v-icon>{{ $t("noRecordsFound") }}
    </v-col>
    <template v-else v-for="eq in equipment">
      <v-col cols="12" md="3" :key="eq.id">
        <v-card rounded="lg">
          <v-card-title>
            {{ eq.name }}
            <span class="grey--text text--darken-1 text-caption ml-1">
              ({{ eq.type.name }})
            </span>
          </v-card-title>
          <v-card-subtitle>
            <template v-if="eq.user == null">
              <v-icon color="green" class="mt-n1" small>
                mdi-check-circle
              </v-icon>
              {{ $t("available") }}
            </template>
            <template v-else>
              <v-icon color="red" class="mt-n1" small>
                mdi-close-circle
              </v-icon>
              {{ $t("inUseBy") }}:
              <span class="font-weight-bold">
                {{ eq.user.id == user.id ? $t("you") : eq.user.username }}
              </span>
            </template>
          </v-card-subtitle>
          <v-divider />
          <v-card-text class="text-center text-md-right">
            <v-btn
              v-if="!isAdmin"
              :disabled="
                eq.user != null &&
                  (eq.user.id == user.id || eq.user.id != user.id)
              "
              small
              color="success"
              class="mr-2"
              @click="reserveEquipment(eq.id)"
            >
              {{ $t("reserve") }}
            </v-btn>
            <v-btn
              :disabled="
                !canUnassignEquipment(eq.user != null ? eq.user.id : null)
              "
              small
              color="error"
              @click="unassignEquipment(eq.id)"
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
      <validation-observer ref="newEquipmentTypeForm" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(addNewEquipmentType)">
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
                :loading="dialogLoading"
                :disabled="dialogLoading"
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
      <validation-observer ref="newEquipmentForm" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(addNewEquipment)">
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
                  item-text="name"
                  item-value="id"
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
import MembershipMixin from "../mixins/membershipMixin";
import LoadingMixin from "../mixins/loadingMixin";
import HeaderDialog from "../components/HeaderDialog";
import routeNames from "../router/routeNames";
import EquipmentService from "../services/equipmentService";

export default {
  name: "Equipment",
  mixins: [UserMixin, MembershipMixin, LoadingMixin],
  components: {
    HeaderDialog
  },
  async created() {
    this.getEquipmentTypes();
    this.getEquipment();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.validMembership) {
        vm.$emit("show-snackbar", {
          color: "error",
          message: vm.$t("extendMembershipWarning")
        });
        next({ name: routeNames.HOME });
      } else {
        next();
      }
    });
  },
  methods: {
    async unassignEquipment(equipmentId) {
      try {
        await EquipmentService.unassignFromUser(equipmentId);
        this.$emit("show-snackbar", {
          color: "success",
          message: this.$t("equipmentUnassigned")
        });
      } catch (e) {
        this.$emit("show-snackbar", {
          color: "error",
          message: this.$t("equipmentUnassignedFailed")
        });
      } finally {
        this.getEquipment();
      }
    },
    async getEquipment() {
      this.setLoading(true);
      const {
        data: { data }
      } = await EquipmentService.getEquipment(
        this.searchInput.name,
        this.searchInput.onlyMyEquipment,
        this.searchInput.type
      );
      this.equipment = data;
      this.setLoading(false);
    },
    async reserveEquipment(equipmentId) {
      try {
        await EquipmentService.assignToCurrentUser(equipmentId);
        this.$emit("show-snackbar", {
          color: "success",
          message: this.$t("equipmentReserved")
        });
      } catch (e) {
        this.$emit("show-snackbar", {
          color: "error",
          message: this.$t("equipmentReservedFailed")
        });
      } finally {
        this.getEquipment();
      }
    },
    canUnassignEquipment(userId) {
      if (userId) {
        if (this.user.id == userId || this.user.isAdmin) {
          return true;
        }
      }
      return false;
    },
    async getEquipmentTypes() {
      this.equipmentTypesLoading = true;
      const {
        data: { data }
      } = await EquipmentService.getAllTypes();
      this.equipmentTypes = data;
      this.equipmentTypesLoading = false;
    },
    search: debounce(async function() {
      this.getEquipment();
    }, 750),
    async addNewEquipment() {
      this.dialogLoading = true;
      await EquipmentService.createEquipment({
        name: this.newEquipment.name,
        typeId: this.newEquipment.type
      });
      this.$emit("show-snackbar", {
        color: "success",
        message: this.$t("equipmentCreated")
      });
      this.dialogLoading = false;
      this.resetNewEquipmentDialog();
    },
    async addNewEquipmentType() {
      this.dialogLoading = true;
      await EquipmentService.createEquipmentType(this.newEquipmentTypeName);
      this.$emit("show-snackbar", {
        color: "success",
        message: this.$t("equipmentTypeCreated")
      });
      this.dialogLoading = false;
      this.resetNewEquipmentTypeDialog();
    },
    resetNewEquipmentDialog() {
      this.newEquipment.type = null;
      this.newEquipment.name = null;
      this.$refs.newEquipmentForm.reset();
      this.newEquipmentDialog = false;
    },
    resetNewEquipmentTypeDialog() {
      this.newEquipmentTypeName = null;
      this.$refs.newEquipmentTypeForm.reset();
      this.getEquipmentTypes();
      this.newEquipmentTypeDialog = false;
    }
  },
  data: () => ({
    equipmentTypesLoading: false,
    newEquipment: {
      type: null,
      name: null
    },
    newEquipmentTypeName: null,
    newEquipmentLoading: false,
    dialogLoading: false,
    newEquipmentDialog: false,
    newEquipmentTypeDialog: false,
    searching: false,
    equipment: [],
    equipmentTypes: [],
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
