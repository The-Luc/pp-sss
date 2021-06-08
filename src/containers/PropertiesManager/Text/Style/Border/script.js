import Select from '@/components/Select';

export default {
  components: {
    Select
  },
  props: {
    selectedBorder: {
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
     * Emit border value to parent
     * @param   {Object}  value Value user selected
     */
    onChange(value) {
      this.$emit('change', value);
    }
  }
};
