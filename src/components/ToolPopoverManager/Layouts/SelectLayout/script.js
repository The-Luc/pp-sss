import PpSelect from '@/components/Select';

export default {
  components: {
    PpSelect
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    layoutSelected: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onChangeLayout(layout) {
      this.$emit('change', layout);
    }
  }
};
