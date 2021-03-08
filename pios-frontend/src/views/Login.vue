<template>
  <main class="text-center">
    <v-btn color="primary" @click="login">Login</v-btn>
  </main>
</template>

<script>
import store from "../store/index";

export default {
  name: "Login",
  methods: {
    login() {
      store.dispatch("setUser", {
        id: 1,
        username: "Matija Novosel",
        email: "mnovosel5@gmail.com",
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjE3ODM0NDk5fQ.tkx6_G_A_Zfq9xa8hZxL9zH_VZNBjbFF0AAgWchxz_Y"
      });
      this.$router.push({ name: "home" });
    }
  }
};
</script>
