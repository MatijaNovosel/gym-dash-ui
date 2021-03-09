<template>
  <main class="center-page d-flex flex-column justify-center align-center">
    <v-card class="rounded-lg elevation-2" :max-width="width">
      <div class="grey lighten-5 py-2">
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>mdi-weight-lifter</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">
              Make a GymDash account
            </v-list-item-title>
            <v-list-item-subtitle>
              Start making appointments immediately
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </div>
      <v-divider />
      <v-card-text class="pt-5" style="max-width: 100%;">
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
              <v-col cols="12" class="text-right mt-2">
                <v-btn small type="submit" color="primary">
                  Submit
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </validation-observer>
      </v-card-text>
    </v-card>
    <span class="mt-4 text-subtitle-2">
      Already have an account? Log in
      <router-link :to="{ name: RouteNames.LOGIN }"> here </router-link>
    </span>
  </main>
</template>

<script>
// import AuthService from "../services/authService";
import RouteNames from "../router/routeNames";

export default {
  name: "Login",
  data: () => ({
    email: null,
    password: null,
    username: null,
    showPassword: false,
    RouteNames
  }),
  computed: {
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 220;
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
        /*
        const data = await AuthService.register({
          username: this.observer.username,
          password: this.observer.password
        });
        */
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
