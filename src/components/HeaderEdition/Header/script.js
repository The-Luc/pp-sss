import PpButton from '@/components/Button';
import { mapMutations } from 'vuex';
import { MUTATES } from '@/store/modules/book/const';
export default {
  components: {
    PpButton
  },
  props: {
    nameEditor: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapMutations({
      savePrintCanvas: MUTATES.SAVE_PRINT_CANVAS
    }),
    onChangeView() {
      this.$router.go(-1);
      const canvas = window.printCanvas;
      let objs = canvas.getObjects();
      this.savePrintCanvas({
        data: objs
      });
    }
  }
};
