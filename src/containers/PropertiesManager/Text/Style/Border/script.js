import Select from '@/components/Selectors/Select';
import BorderStyle from './Settings/Style';
import BorderColor from './Settings/Color';
import BorderThickness from './Settings/Thickness';
import { activeCanvas, getRectDashes } from '@/common/utils';
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
     * Computed dash array base on width and height of object
     * @returns   {Array}  Array specifying dash pattern of an object's stroke
     */
    computedDashArray() {
      const objectActive = activeCanvas?.getActiveObject();
      const { width, height } = objectActive;
      const strokeDashArray = getRectDashes(
        width,
        height,
        this.borderStyle,
        this.strokeWidth
      );
      return strokeDashArray;
    },
    /**
     * Set data local and emit stroke width(thickness), stroke dash array value to text properties through root
     * @param   {Number}  value Value user selected
     */
    onChangeThickness(value) {
      this.strokeWidth = value;
      const strokeDashArray = this.computedDashArray();
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        border: {
          strokeDashArray,
          strokeWidth: value
        }
      });
    },
    /**
     * Set data local and emit stroke line cap, stroke dash array value to text properties through root
     * @param   {Number}  value Value user selected
     */
    onChangeBorderStyle({ value }) {
      this.borderStyle = value;
      const strokeDashArray = this.computedDashArray();
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        border: {
          strokeDashArray,
          strokeLineType: value
        }
      });
    }
  }
};
