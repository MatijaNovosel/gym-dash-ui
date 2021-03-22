<template>
  <v-row>
    <v-col cols="12">
      <v-tabs
        :vertical="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
        v-model="tab"
      >
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
      </v-tabs>
      <v-divider />
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card flat class="mt-2">
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
                <v-col cols="12" class="text-right">
                  <v-btn @click="savePersonalInfo" small color="primary">
                    {{ $t("save") }}
                  </v-btn>
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
                    v-model="selectedLocale"
                    label="Locale"
                  />
                </v-col>
                <v-col cols="12" class="text-right">
                  <v-btn @click="saveAppSettings" small color="primary">
                    {{ $t("save") }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-row>
</template>

<script>
import UserMixin from "../mixins/userMixin";
import DarkModeMixin from "../mixins/darkModeMixin";
import LocaleMixin from "../mixins/localeMixin";
// import UserService from "../services/userService";
import { LOCALE } from "../constants/enumerations";
import { selectItemArrayFromEnum } from "../helpers/index";

export default {
  name: "UserProfile",
  mixins: [UserMixin, LocaleMixin, DarkModeMixin],
  methods: {
    saveAppSettings() {
      // await UserService.updatePreference(this.darkMode, this.locale);
      // this.$i18n.locale = this.locale.toLowerCase();
    },
    savePersonalInfo() {
      // Save personal info here
    }
  },
  created() {
    this.username = this.user.username;
    this.email = this.user.email;
    this.selectedLocale = this.localeItems[1];
  },
  computed: {
    localeItems() {
      return selectItemArrayFromEnum("locale", LOCALE);
    }
  },
  data: () => ({
    tab: 0,
    selectedLocale: null,
    username: null,
    email: null,
    showPassword: false
  })
};
</script>
