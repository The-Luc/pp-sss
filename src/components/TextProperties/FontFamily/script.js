import PpSelect from '@/components/Selectors/Select';
import { FONT_FAMILY } from '@/common/constants';

export default {
  components: {
    PpSelect
  },
  props: {
    selectedFont: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      fontFamily: FONT_FAMILY
    };
  },
  methods: {
    /**
     * Emit to back value to parent
     * @param {Object} data new font family of text box
     */
    onChange(data) {
      this.$emit('change', {
        fontFamily: data.value
      });
    }
  }
};
