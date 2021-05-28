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
    onChangeTheme(theme) {
      this.$emit('change', theme);
    }
  }
};
