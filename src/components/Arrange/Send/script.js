import ButtonProperty from '@/components/Buttons/ButtonProperty';
import { ARRANGE_POSITION } from '@/common/constants/arrange';
export default {
  components: {
    ButtonProperty
  },
  methods: {
    /**
     * Emit to back value to parent
     */
    onClickToBack() {
      this.$emit('change', ARRANGE_POSITION.BACK);
    },
    /**
     * Emit to front value to parent
     */
    onClickToFront() {
      this.$emit('change', ARRANGE_POSITION.FRONT);
    },
    /**
     * Emit backward value to parent
     */
    onClickBackward() {
      this.$emit('change', ARRANGE_POSITION.BACKWARD);
    },
    /**
     * Emit forward value to parent
     */
    onClickForward() {
      this.$emit('change', ARRANGE_POSITION.FORWARD);
    }
  }
};
