import Select from '@/components/Selectors/Select';
import BorderStyle from './Settings/Style';
import BorderColor from './Settings/Color';
import BorderThickness from './Settings/Thickness';
import { EVENT_TYPE } from '@/common/constants/eventType';

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
      strokeWidth: 0,
      borderStyle: 'solid'
    };
  },
  methods: {
    /**
     * Emit border value to parent
     * @param   {Object}  value Value user selected
     */
    onChangeSelectedBorder(value) {
      this.$emit('change', value);
    },
    /**
     * Set data local and emit stroke width(thickness), stroke dash array value to text properties through root
     * @param   {Number}  strokeWidth Value user selected
     */
    onChangeThickness(strokeWidth) {
      this.strokeWidth = strokeWidth;
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        border: {
          strokeWidth
        }
      });
    },
    /**
     * Set data local and emit stroke line cap, stroke dash array value to text properties through root
     * @param   {Number}  strokeLineType Value user selected
     */
    onChangeBorderStyle({ value: strokeLineType }) {
      this.borderStyle = strokeLineType;
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        border: {
          strokeLineType
        }
      });
    }
  }
};
