import ButtonProperty from '@/components/Buttons/ButtonProperty';
import { ARRANGE_FLIP } from '@/common/constants/arrange';
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ButtonProperty
  },
  methods: {
    /**
     * Emit flip horizontal value to parent
     */
    onClickHorizontal() {
      this.$emit('change', ARRANGE_FLIP.HORIZONTAL);
    },
    /**
     * Emit flip vertical value to parent
     */
    onClickVertical() {
      this.$emit('change', ARRANGE_FLIP.VERTICAL);
    }
  }
};
