import PpSelect from '@/components/Selectors/Select';
import { useElementProperties } from '@/hooks';
import { BORDER_STYLE, BORDER_STYLES } from '@/common/constants';

export default {
  components: {
    PpSelect
  },
  setup() {
    const { getProperty } = useElementProperties();

    return {
      getProperty
    };
  },
  data() {
    return {
      options: BORDER_STYLE
    };
  },
  computed: {
    selectedBorderStyle() {
      const selectedBorderStyle = this.getProperty('border');
      const borderStyleValue =
        selectedBorderStyle?.strokeLineType || BORDER_STYLES.SOLID;

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
