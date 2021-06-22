import { ARRANGE_SEND } from '@/common/constants/arrange';
import ButtonProperty from '@/components/Buttons/ButtonProperty';

export default {
  components: {
    ButtonProperty
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      SEND: ARRANGE_SEND
    };
  },
  methods: {
    /**
     * Emit to back value to parent
     */
    onClick(actionName) {
      this.$emit('change', actionName);
    }
  }
};
