import PpInput from '@/components/InputProperty';

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
    }
  },
  components: {
    PpInput
  },
  data() {
    return {
      trackColor: '#D3D3D3',
      trackFillColor: '#42738D',
      thumbColor: '#FFFFFF'
    };
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
