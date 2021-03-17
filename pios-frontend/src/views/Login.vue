<template>
  <main class="center-page d-flex flex-column justify-center align-center">
    <v-card class="rounded-lg elevation-2" :max-width="width">
      <div class="grey lighten-5 py-2">
        <v-list-item>
          <v-list-item-avatar class="d-none d-sm-block">
            <v-icon>mdi-weight-lifter</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">
              {{ $t("logIntoGymDash") }}
            </v-list-item-title>
            <v-list-item-subtitle class="d-none d-sm-block">
              {{ $t("logInWithYourSpecifiedCredentials") }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </div>
      <v-divider />
      <v-card-text class="pt-5">
        <validation-observer ref="observer">
          <form @submit.prevent="login">
            <v-row>
              <v-col cols="12">
                <validation-provider
                  vid="username"
                  :name="$t('username')"
                  rules="required"
                  v-slot="{ errors, valid, untouched, required, failed }"
                >
                  <v-text-field
                    v-model="username"
                    :error-messages="errors"
                    :hide-details="valid || (untouched && !failed)"
                    dense
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("username") }}</span>
                    </template>
                  </v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  vid="password"
                  :name="$t('password')"
                  rules="required"
                  v-slot="{ errors, valid, untouched, required, failed }"
                >
                  <v-text-field
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    :error-messages="errors"
                    :hide-details="valid || (untouched && !failed)"
                    dense
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("password") }}</span>
                    </template>
                    <template #append>
                      <v-btn
                        icon
                        size="sm"
                        @click="showPassword = !showPassword"
                      >
                        <v-icon
                          v-text="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        />
                      </v-btn>
                    </template>
                  </v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" class="text-center text-md-right mt-2">
                <v-btn
                  :loading="loading"
                  :disabled="loading"
                  small
                  type="submit"
                  color="primary"
                >
                  {{ $t("submit") }}
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </validation-observer>
      </v-card-text>
    </v-card>
    <span class="mt-4 text-subtitle-2">
      {{ $t("dontHaveAnAccount") }}? {{ $t("register") }}
      <router-link :to="{ name: RouteNames.REGISTER }">
        {{ $t("here").toLowerCase() }}
      </router-link>
    </span>
  </main>
</template>

<script>
import AuthService from "../services/authService";
import { mapActions } from "vuex";
import RouteNames from "../router/routeNames";

export default {
  name: "Login",
  data: () => ({
    loading: false,
    username: null,
    password: null,
    showPassword: false,
    RouteNames
  }),
  computed: {
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 300;
        case "sm":
          return 400;
        case "md":
          return 500;
        case "lg":
          return 600;
        case "xl":
          return 700;
        default:
          return 500;
      }
    }
  },
  methods: {
    ...mapActions(["setUser"]),
    async login() {
      const success = await this.$refs.observer.validate();
      if (success) {
        this.loading = true;

        const response = await AuthService.login(this.username, this.password);

        if (response.status >= 400) {
          const { data } = response;
          this.$emit("show-snackbar", {
            color: "error",
            message: data.error
          });
          this.loading = false;
        } else {
          const {
            data: { data }
          } = response;
          this.setUser({
            id: data.id,
            username: this.username,
            email: data.email,
            token: data.jwtToken,
            role: {
              id: 1
            }
          });
          this.$emit("show-snackbar", {
            color: "success",
            message: this.$t("loginSuccess")
          });
          this.$router.push({ name: "home" });
          this.loading = false;
        }
      }
    }
  }
};
</script>

<style scoped lang="sass">
.center-page
  width: 100vw
  height: 100vh
</style>
