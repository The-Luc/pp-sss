import { mapActions } from "vuex";
import { ACTIONS } from "../../store/modules/auth/const";
import { users } from "./dummy";

export default {
  data: () => ({
    user: "",
    password: "",
    users,
    notTrue: false
  }),

  computed: {
    userErrors() {
      const errors = [];
      if (!this.$v.user.$dirty) return errors;
      !this.$v.user.minLength &&
        errors.push(this.$i18n.t("login.userMustBeAtMost5CharactersLong"));
      !this.$v.user.required &&
        errors.push(this.$i18n.t("login.userIsRequired"));
      return errors;
    },
    passWordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push(this.$i18n.t("login.passwordMustBeAtMost5CharactersLong"));
      !this.$v.password.required &&
        errors.push(this.$i18n.t("login.passwordIsRequired"));
      return errors;
    }
  },

  methods: {
    ...mapActions({
      login: ACTIONS.LOGIN
    }),
    submit() {
      this.$v.$touch();
      const user = this.users.find(item => {
        return item.user === this.user && item.password === this.password;
      });
      if (!user) {
        this.notTrue = true;
        return setTimeout(() => (this.notTrue = false), 3000);
      } else {
        return this.login();
      }
    },
    clear() {
      this.$v.$reset();
      this.name = "";
      this.email = "";
    }
  }
};
