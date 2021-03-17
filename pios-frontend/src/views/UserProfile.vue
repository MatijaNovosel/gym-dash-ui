<template>
  <v-tabs vertical>
    <v-tab>
      <v-icon left class="mr-3">
        mdi-account
      </v-icon>
      Personal info
    </v-tab>
    <v-tab>
      <v-icon left class="mr-3">
        mdi-cogs
      </v-icon>
      App settings
    </v-tab>
    <v-tab-item>
      <v-card flat>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                dense
                outlined
                readonly
                hide-details
                :value="username"
                :label="$t('username')"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                outlined
                readonly
                hide-details
                :value="email"
                :label="$t('email')"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-tab-item>
    <v-tab-item>
      <v-card flat>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select
                outlined
                dense
                hide-details
                item-text="text"
                item-value="value"
                :items="localeItems"
                v-model="locale"
                label="Locale"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import UserMixin from "../mixins/userMixin";
import { LOCALE } from "../constants/enumerations";
import { selectItemArrayFromEnum } from "../helpers/index";

export default {
  name: "UserProfile",
  mixins: [UserMixin],
  methods: {
    save() {
      //
    }
  },
  created() {
    this.username = this.user.username;
    this.email = this.user.email;
    this.locale = this.localeItems[1];
  },
  computed: {
    localeItems() {
      return selectItemArrayFromEnum("locale", LOCALE);
    }
  },
  data: () => ({
    locale: null,
    username: null,
    email: null,
    showPassword: false
  })
};
</script>
