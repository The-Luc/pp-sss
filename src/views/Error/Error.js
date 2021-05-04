import { fetchErrorAPI } from "../../api/error";
import { mapMutations } from "vuex";
import { MUTATES } from "../../store/modules/app/const";

export default {
  methods: {
    handleClick(code) {
      fetchErrorAPI(code);
    },
    ...mapMutations({
      handleIsDialog: MUTATES.HANDLEISDIALOG
    })
  }
};
