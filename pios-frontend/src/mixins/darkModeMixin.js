import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["darkMode"])
  },
  methods: {
    ...mapActions(["setDarkMode"])
  }
}