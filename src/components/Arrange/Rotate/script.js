import PpInput from '@/components/InputProperty';
export default {
  components: {
    PpInput
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Emit rotate value to parent
     * @param {Number}  val rotate value user entered
     */
    onChange(val) {
      this.$emit('change', { coord: { rotation: val } });
    }
  }
};
