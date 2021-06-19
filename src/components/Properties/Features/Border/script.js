import Select from '@/components/Selectors/Select';
import BorderStyle from '@/containers/Property/Style';
import BorderColor from '@/containers/Property/Color';
import BorderThickness from './Settings/Thickness';
import { getRectDashes } from '@/common/utils';

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
      isShowStyle: false,
      strokeWidth: 0,
      borderStyle: 'solid'
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
    onChangeSelectedBorder(value) {
      this.$emit('change', value);
    },
    /**
     * Computed dash array base on width and height of object
     * @returns   {Array}  Array specifying dash pattern of an object's stroke
     */
    computedDashArray() {
      const objectActive = window.printCanvas.getActiveObject();
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
      this.$root.$emit('printChangeTextProperties', {
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
      this.$root.$emit('printChangeTextProperties', {
        border: {
          strokeDashArray,
          strokeLineCap: value
        }
      });
    }
  }
};
