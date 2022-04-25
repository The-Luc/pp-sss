import PpSelectMulti from '@/components/Selectors/SelectMultiLevel';

export default {
  components: {
    PpSelectMulti
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
      default: () => ({ name: '', value: '' })
    }
  },
  methods: {
    onChangeLayout(layout) {
      this.$emit('change', layout);
    }
  }
};
