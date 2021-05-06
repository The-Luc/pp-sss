import { mapState, mapMutations } from "vuex";
import { MUTATES } from "../../store/modules/app/const";

export default {
  computed: mapState({
    dialog: state => state.app.isDialog
  }),
  methods: {
    ...mapMutations({
      handleIsDialog: MUTATES.HANDLEISDIALOG
    })
  }
};
