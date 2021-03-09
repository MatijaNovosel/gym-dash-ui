<template>
  <main class="center-page d-flex flex-column justify-center align-center">
    <v-card class="rounded-lg elevation-2">
      <div class="grey lighten-5 py-2">
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>mdi-weight-lifter</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">
              Log into GymDash
            </v-list-item-title>
            <v-list-item-subtitle>
              Log in with your specified credentials
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
                  vid="usernameOrEmail"
                  :name="$t('usernameOrEmail')"
                  rules="required"
                  v-slot="{ errors, valid, untouched, required, failed }"
                >
                  <v-text-field
                    v-model="usernameOrEmail"
                    :error-messages="errors"
                    :hide-details="valid || (untouched && !failed)"
                    dense
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("usernameOrEmail") }}</span>
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
      Don't have an account? Register
      <router-link :to="{ name: RouteNames.REGISTER }"> here </router-link>
    </span>
  </main>
</template>

<script>
// import AuthService from "../services/authService";
import { mapActions } from "vuex";
import RouteNames from "../router/routeNames";

export default {
  name: "Login",
  data: () => ({
    usernameOrEmail: null,
    password: null,
    showPassword: false,
    RouteNames
  }),
  methods: {
    ...mapActions(["setUser"]),
    async login() {
      const success = await this.$refs.observer.validate();
      if (success) {
        /*
        const data = await AuthService.login({
          username: this.observer.username,
          password: this.observer.password
        });
        */
        this.setUser({
          id: 1,
          username: "Matija Novosel",
          email: "mnovosel5@gmail.com",
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjE3ODM0NDk5fQ.tkx6_G_A_Zfq9xa8hZxL9zH_VZNBjbFF0AAgWchxz_Y"
        });
        this.$router.push({ name: "home" });
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
