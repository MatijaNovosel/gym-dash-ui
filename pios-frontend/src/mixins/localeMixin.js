import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["locale"])
  },
  methods: {
    ...mapActions(["setLocale"])
  }
}