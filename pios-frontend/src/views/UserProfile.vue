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
          {{ $t("personalInfo") }}
        </v-tab>
        <v-tab>
          <v-icon left class="mr-3">
            mdi-cogs
          </v-icon>
          {{ $t("appSettings") }}
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
                    disabled
                    hide-details
                    :value="username"
                    :label="$t('username')"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    dense
                    outlined
                    disabled
                    hide-details
                    :value="email"
                    :label="$t('email')"
                  />
                </v-col>
                <v-col cols="12">
                  <validation-provider
                    ref="newPasswordProvider"
                    vid="newPassword"
                    :name="$t('newPassword')"
                    rules="required|min:4"
                    v-slot="{ errors, valid, untouched, required, failed }"
                  >
                    <v-text-field
                      :loading="loading"
                      :disabled="loading"
                      outlined
                      :type="showPassword ? 'text' : 'password'"
                      v-model="newPassword"
                      :error-messages="errors"
                      :hide-details="valid || (untouched && !failed)"
                      dense
                    >
                      <template #label>
                        <required-icon v-show="required" />
                        <span>{{ $t("newPassword") }}</span>
                      </template>
                      <template #append>
                        <v-btn icon small @click="showPassword = !showPassword">
                          <v-icon
                            v-text="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          />
                        </v-btn>
                      </template>
                    </v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" class="text-right">
                  <v-btn @click="saveNewPassword" small color="primary">
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
                    item-text="text"
                    item-value="value"
                    return-object
                    outlined
                    dense
                    hide-details
                    :items="localeItems"
                    v-model="selectedLocale"
                    :label="$t('localeVal')"
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
import UserService from "../services/userService";

export default {
  name: "UserProfile",
  mixins: [UserMixin, LocaleMixin, DarkModeMixin],
  methods: {
    async saveAppSettings() {
      this.loading = true;
      try {
        await UserService.updatePreference(
          this.darkMode,
          this.selectedLocale.value
        );
        this.$i18n.locale = this.selectedLocale.value.toLowerCase();
        this.$vuetify.lang.current = this.selectedLocale.value.toLowerCase();
        this.setLocale(this.selectedLocale.value);
        this.$emit("show-snackbar", {
          color: "success",
          message: this.$t("preferencesUpdated")
        });
      } catch (e) {
        this.$emit("show-snackbar", {
          color: "error",
          message: e.message
        });
      } finally {
        this.loading = false;
      }
    },
    async saveNewPassword() {
      this.loading = true;
      try {
        await UserService.changePassword(this.newPassword);
        this.$emit("show-snackbar", {
          color: "success",
          message: this.$t("passwordChanged")
        });
      } catch (e) {
        this.$emit("show-snackbar", {
          color: "error",
          message: e.message
        });
      } finally {
        this.loading = false;
        this.newPassword = null;
        this.$refs.newPasswordProvider.reset();
      }
    }
  },
  created() {
    this.username = this.user.username;
    this.email = this.user.email;
    this.selectedLocale = this.localeItems.filter(
      (x) => x.value == this.locale
    )[0];
  },
  computed: {
    localeItems() {
      return [
        {
          value: "HR",
          text: this.$t("locale.HR")
        },
        {
          value: "EN",
          text: this.$t("locale.EN")
        }
      ];
    }
  },
  data: () => ({
    loading: false,
    tab: 0,
    selectedLocale: null,
    username: null,
    email: null,
    showPassword: false,
    newPassword: null
  })
};
</script>
