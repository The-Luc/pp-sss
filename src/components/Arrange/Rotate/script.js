import PpNumber from '@/components/Number';
export default {
  components: {
    PpNumber
  },
  props: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    /**
     * Emit rotate value to parent
     * @param {Object}  value value user entered
     */
    onChange(val) {
      this.$emit('change', val);
    }
  }
};
