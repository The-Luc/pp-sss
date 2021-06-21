import ButtonProperty from '@/components/Buttons/ButtonProperty';
import { ARRANGE_SEND } from '@/common/constants/arrange';
export default {
  components: {
    ButtonProperty
  },
  methods: {
    /**
     * Emit to back value to parent
     */
    onClickToBack() {
      this.$emit('change', ARRANGE_SEND.BACK);
    },
    /**
     * Emit to front value to parent
     */
    onClickToFront() {
      this.$emit('change', ARRANGE_SEND.FRONT);
    },
    /**
     * Emit backward value to parent
     */
    onClickBackward() {
      this.$emit('change', ARRANGE_SEND.BACKWARD);
    },
    /**
     * Emit forward value to parent
     */
    onClickForward() {
      this.$emit('change', ARRANGE_SEND.FORWARD);
    }
  }
};
