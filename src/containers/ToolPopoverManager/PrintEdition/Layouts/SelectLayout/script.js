import PpSelectMulti from '@/components/Selectors/SelectMultiLevel';
import PpSelect from '@/components/Selectors/Select';

export default {
  components: {
    PpSelectMulti,
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
      default: () => ({ name: '', value: '' })
    },
    isDigital: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onChangeLayout(layout) {
      this.$emit('change', layout);
    }
  }
};
