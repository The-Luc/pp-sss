import PpNumber from '@/components/Number';
export default {
  components: {
    PpNumber
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
