import router from "../../router";
import "./PageNotFound.scss";

export default {
  methods: {
    redirectHomePage() {
      router.push("/");
    }
  }
};
