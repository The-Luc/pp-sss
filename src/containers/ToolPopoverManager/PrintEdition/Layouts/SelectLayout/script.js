import PpSelect from '@/components/Selectors/Select';

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
    title: {
      type: String,
      required: true
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
