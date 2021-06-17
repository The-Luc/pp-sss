import PpNumber from '@/components/Number';
export default {
  components: {
    PpNumber
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    onChange(val) {
      this.$emit('change', val);
    }
  }
};
