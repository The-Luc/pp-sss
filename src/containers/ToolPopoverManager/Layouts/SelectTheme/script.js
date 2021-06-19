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
    themeSelected: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onChangeTheme(theme) {
      this.$emit('change', theme);
    }
  }
};
