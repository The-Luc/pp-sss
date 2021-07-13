import Select from '@/components/Selectors/Select';
import BorderStyle from './Settings/Style';
import BorderColor from './Settings/Color';
import BorderThickness from './Settings/Thickness';
import { BORDER_TYPES, BORDER_TYPE } from '@/common/constants/borderType';
import { DEFAULT_BORDER } from '@/common/constants';

export default {
  components: {
    Select,
    BorderStyle,
    BorderColor,
    BorderThickness
  },
  props: {
    currentBorder: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      options: BORDER_TYPES
    };
  },
  computed: {
    showBorder() {
      return this.currentBorder.showBorder || false;
    },
    selectedBorder() {
      if (!this.showBorder) {
        return BORDER_TYPE.NO_BORDER;
      }
      return BORDER_TYPE.LINE;
    },
    strokeLineType() {
      return (
        this.currentBorder.strokeLineType || DEFAULT_BORDER.STROKE_LINE_TYPE
      );
    },
    strokeColor() {
      return this.currentBorder.stroke || DEFAULT_BORDER.STROKE;
    },
    strokeWidth() {
      return this.currentBorder.strokeWidth || DEFAULT_BORDER.STROKE_WIDTH;
    }
  },
  methods: {
    /**
     * Emit border value to parent
     * @param   {Object}  border - Border data input by user
     */
    onChange(border) {
      this.$emit('change', border);
    },
    /**
     * Emit border value to parent
     * @param   {String}  value Value user selected
     */
    onChangeSelectedBorder({ value }) {
      const showBorder = value === BORDER_TYPE.LINE.value;
      const border = {
        showBorder,
        stroke: DEFAULT_BORDER.STROKE,
        strokeDashArray: DEFAULT_BORDER.STROKE_DASH_ARRAY,
        strokeLineType: DEFAULT_BORDER.STROKE_LINE_TYPE,
        strokeWidth: !showBorder ? DEFAULT_BORDER.STROKE_WIDTH : 1
      };

      this.onChange(border);
    },
    /**
     * Emit selected strokeWidth to parent component
     * @param   {Number}  strokeWidth Value user selected
     */
    onChangeThickness(strokeWidth) {
      this.onChange({ strokeWidth });
    },
    /**
     * Emit selected strokeLineType to parent component
     * @param   {String}  strokeLineType Value user selected
     */
    onChangeBorderStyle({ value: strokeLineType }) {
      this.onChange({ strokeLineType });
    },
    /**
     * Emit selected stroke's Color to parent component
     * @param   {String}  color Value user selected
     */
    onChangeBorderColor(color) {
      this.onChange({ stroke: color });
    }
  }
};
