import { BORDER_STYLE, BORDER_STYLES } from '@/common/constants';
import Select from '@/components/Selectors/Select';

export default {
  components: {
    Select
  },
  props: {
    selectedStyle: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      options: BORDER_STYLE
    };
  },
  computed: {
    selectedBorderStyle() {
      const borderStyleValue = this.selectedStyle || BORDER_STYLES.SOLID;

      return this.options.find(item => item.value === borderStyleValue);
    }
  },
  methods: {
    /**
     * Emit border value to parent
     * @param   {Object}  val Border object selected
     */
    onChange(val) {
      this.$emit('change', val);
    }
  }
};
