import FlipControl from './FlipControl';

import { ARRANGE_FLIP } from '@/common/constants/arrange';

export default {
  components: {
    FlipControl
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
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
