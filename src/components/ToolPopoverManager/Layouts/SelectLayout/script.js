import PpSelect from '@/components/Select';

export default {
  components: {
    PpSelect
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    onChangeLayout(layout) {
      this.$emit('change', layout);
    }
  }
};
