<template>
  <main class="center-page d-flex justify-center align-center">
    <v-card class="rounded-lg elevation-1">
      <v-card-title>
        Log into GymDash
      </v-card-title>
      <v-card-subtitle>
        Log in with your specified credentials
      </v-card-subtitle>
      <v-card-text>
        <validation-observer ref="loginForm" v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(login)">
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
                    filled
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
                    type="password"
                    v-model="password"
                    :error-messages="errors"
                    :hide-details="valid || (untouched && !failed)"
                    filled
                    dense
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("password") }}</span>
                    </template>
                  </v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" class="text-right">
                <v-btn small type="submit" color="primary" @click="login">
                  Submit
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </main>
</template>

<script>
// import AuthService from "../services/authService";
import { mapActions } from "vuex";

export default {
  name: "Login",
  data: () => ({
    usernameOrEmail: null,
    password: null
  }),
  methods: {
    ...mapActions(["setUserData"]),
    async login() {
      const success = await this.$refs.loginForm.validate();
      if (success) {
        /*
        const data = await AuthService.login({
          username: this.loginForm.username,
          password: this.loginForm.password
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
