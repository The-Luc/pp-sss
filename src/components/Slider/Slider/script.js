import PpInput from '@/components/Input/InputProperty';

import { DEFAULE_SLIDER } from '@/common/constants';

export default {
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    value: {
      type: Number,
      default: 0
    },
    suffix: {
      type: String,
      default: '%'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isInputHidden: {
      type: Boolean,
      default: false
    },
    trackColor: {
      type: String,
      default: DEFAULE_SLIDER.COLOR
    },
    trackFillColor: {
      type: String,
      default: DEFAULE_SLIDER.FILL_COLOR
    },
    thumbColor: {
      type: String,
      default: DEFAULE_SLIDER.THUMB_COLOR
    }
  },
  components: {
    PpInput
  },
  methods: {
    /**
     * Catch event user dragging slider and call function to emit value to parent
     * @param   {String}  value Value user input
     */
    onChangeSlider(value) {
      this.emitData(value);
    },
    /**
     * Catch event user dragging slider and call function to emit value to parent
     * @param   {String}  value Value user input
     */
    onChangeInput(value) {
      this.emitData(value);
    },
    /**
     * Emit data to parent
     * @param   {String}  value Value user input
     */
    emitData(value) {
      this.$emit('change', +value);
    }
  }
};
