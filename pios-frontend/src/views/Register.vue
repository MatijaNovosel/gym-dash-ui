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
              {{ $t("makeGymDashAccount") }}
            </v-list-item-title>
            <v-list-item-subtitle class="d-none d-sm-block">
              {{ $t("startMakingAppointmentsImmediately") }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </div>
      <v-divider />
      <v-card-text class="pt-5">
        <validation-observer ref="observer">
          <form @submit.prevent="register">
            <v-row>
              <v-col cols="12">
                <validation-provider
                  vid="email"
                  :name="$t('email')"
                  rules="required|email"
                  v-slot="{ errors, valid, untouched, required, failed }"
                >
                  <v-text-field
                    v-model="email"
                    :error-messages="errors"
                    :hide-details="valid || (untouched && !failed)"
                    dense
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("email") }}</span>
                    </template>
                  </v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  vid="username"
                  :name="$t('username')"
                  rules="required|min:4"
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
                  rules="required|min:4"
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
                      <v-btn icon small @click="showPassword = !showPassword">
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
      {{ $t("haveAnAccount") }}? {{ $t("login") }}
      <router-link :to="{ name: RouteNames.LOGIN }">
        {{ $t("here").toLowerCase() }}
      </router-link>
    </span>
  </main>
</template>

<script>
import AuthService from "../services/authService";
import RouteNames from "../router/routeNames";

export default {
  name: "Login",
  data: () => ({
    email: null,
    password: null,
    username: null,
    showPassword: false,
    loading: false,
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
    async register() {
      const success = await this.$refs.observer.validate();
      if (success) {
        try {
          this.loading = true;
          await AuthService.register(this.username, this.email, this.password);
          this.$emit("show-snackbar", {
            color: "success",
            message: this.$t("registerSuccess")
          });
          this.email = this.username = this.password = null;
          this.$refs.observer.reset();
        } catch (e) {
          this.$emit("show-snackbar", {
            color: "red darken-2",
            message: e.message
          });
        } finally {
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
