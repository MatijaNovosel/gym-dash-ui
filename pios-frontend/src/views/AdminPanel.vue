<template>
  <v-row>
    <v-col cols="12">
      All available users
    </v-col>
    <v-col cols="12" class="pt-0">
      <v-data-table :loading="loading" :headers="headers" :items="users">
        <template #item.role="{ item }">
          {{ $t(`roles.${item.role.name}`) }}
        </template>
        <template #item.actions>
          <v-btn small> Details </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import UserService from "../services/userService";
import { AUTH_ROLE } from "../constants/enumerations";

export default {
  name: "AdminPanel",
  data: () => ({
    AUTH_ROLE,
    users: [],
    loading: false
  }),
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
