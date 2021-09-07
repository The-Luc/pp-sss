import PpSelect from '@/components/Selectors/Select';

export default {
  components: {
    PpSelect
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => []
    },
    selectedVal: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    /**
     * Emit change event to parent component
     * @param {Object} val flow setting
     */
    onChange(val) {
      this.$emit('change', val);
    }
  }
};
