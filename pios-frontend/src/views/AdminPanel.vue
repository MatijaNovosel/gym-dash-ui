<template>
  <v-row>
    <v-col cols="12">
      {{ $t("allAvailableUsers") }}
    </v-col>
    <v-col cols="12" class="pt-0">
      <v-data-table :loading="loading" :headers="headers" :items="users">
        <template #item.role="{ item }">
          {{ $t(`roles.${getKeyByValue(AUTH_ROLE, item.role)}`) }}
        </template>
        <template #item.actions="{ item }">
          <v-btn small @click="openUserDetailsDialog(item.id)">
            {{ $t("details") }}
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
    <header-dialog
      max-width="50%"
      v-model="userDetailsDialog"
      :title="$t('userDetails')"
      @close="userDetailsDialog = false"
    >
      <v-row>
        <v-col cols="12" class="text-subtitle-2">
          {{ $t("previousMembershipPurchases") }}
        </v-col>
        <v-col cols="12" class="pt-0">
          <membership-table :items="activeUser.memberships" />
        </v-col>
      </v-row>
    </header-dialog>
  </v-row>
</template>

<script>
import UserService from "../services/userService";
import MembershipService from "../services/membershipService";
import { AUTH_ROLE } from "../constants/enumerations";
import { getKeyByValue } from "../helpers/index";
import HeaderDialog from "../components/HeaderDialog";
import MembershipTable from "../components/MembershipTable.vue";

export default {
  name: "AdminPanel",
  components: {
    HeaderDialog,
    MembershipTable
  },
  data: () => ({
    AUTH_ROLE,
    userDetailsDialog: false,
    users: [],
    activeUser: {
      id: null,
      memberships: []
    },
    loading: false
  }),
  methods: {
    getKeyByValue,
    async openUserDetailsDialog(userId) {
      this.userDetailsLoading = true;
      this.activeUser.id = userId;

      const responseMembership = await MembershipService.getAllMembershipsOfUser(
        userId
      );

      if (responseMembership.status >= 400) {
        this.activeUser.memberships = [];
      } else {
        const {
          data: { data }
        } = responseMembership;
        this.activeUser.memberships = data;
      }

      this.userDetailsLoading = false;
      this.userDetailsDialog = true;
    }
  },
  computed: {
    headers() {
      return [
        {
          text: "Id",
          value: "id",
          align: "center",
          sortable: false
        },
        {
          text: this.$t("username"),
          value: "username",
          sortable: false
        },
        {
          text: this.$t("email"),
          value: "email",
          sortable: false
        },
        {
          text: this.$t("role"),
          value: "role",
          sortable: false
        },
        {
          text: null,
          value: "actions",
          sortable: false
        }
      ];
    }
  },
  async created() {
    this.loading = true;
    const {
      data: { data }
    } = await UserService.getAllUsers();
    this.users = data;
    this.loading = false;
  }
};
</script>
