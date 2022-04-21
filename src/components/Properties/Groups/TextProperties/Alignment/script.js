import PpButtonGroup from '@/components/Buttons/ButtonGroup';
import { TEXT_HORIZONTAL_ALIGN } from '@/common/constants';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    PpButtonGroup
  },
  props: {
    selectedAlignment: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showJustify: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      JUSTIFY: TEXT_HORIZONTAL_ALIGN.JUSTIFY,
      LEFT: TEXT_HORIZONTAL_ALIGN.LEFT,
      RIGHT: TEXT_HORIZONTAL_ALIGN.RIGHT,
      CENTER: TEXT_HORIZONTAL_ALIGN.CENTER
    };
  },
  methods: {
    /**
     * Detect click on item on text alignment properties
     * @param  {String} data Receive item information
     */
    onChange(data) {
      const value = isEmpty(data) ? TEXT_HORIZONTAL_ALIGN.LEFT : data;
      this.$emit('change', {
        alignment: { horizontal: value }
      });
    }
  }
};
