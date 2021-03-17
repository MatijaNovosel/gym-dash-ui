import { mapGetters, mapActions } from "vuex";
import { AUTH_ROLE } from "../constants/enumerations";

export default {
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    ...mapActions(["setUser"]),
    isAdmin() {
      return this.user.role == AUTH_ROLE.ADMIN;
    }
  }
}