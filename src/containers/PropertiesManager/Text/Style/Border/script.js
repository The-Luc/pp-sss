import Select from '@/components/Select';
import BorderStyle from './Settings/Style';
import BorderColor from './Settings/Color';
import BorderThickness from './Settings/Thickness';

export default {
  components: {
    Select,
    BorderStyle,
    BorderColor,
    BorderThickness
  },
  props: {
    selectedBorder: {
      type: Object,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isShowStyle: false
    };
  },
  watch: {
    selectedBorder: {
      deep: true,
      handler(border) {
        this.isShowStyle = border.value === 'line';
      }
    }
  },
  methods: {
    /**
     * Emit border value to parent
     * @param   {Object}  value Value user selected
     */
    onChange(value) {
      this.$emit('change', value);
    }
  }
};
