import Select from '@/components/Select';

export default {
  components: {
    Select
  },
  props: {
    selectedShadow: {
      type: Object,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  methods: {
    /**
     * Emit shadow value to parent
     * @param   {Object}  value Value user selected
     */
    onChange(value) {
      this.$emit('change', value);
    }
  }
};
