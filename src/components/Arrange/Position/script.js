import { splitNumberByDecimal, validateInputOption } from '@/common/utils';
import TextFieldProperty from '@/components/TextFieldProperty';
export default {
  components: {
    TextFieldProperty
  },
  props: {
    valueX: {
      type: Number,
      default: 0
    },
    valueY: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    valueXPt() {
      return splitNumberByDecimal(this.valueX);
    },
    valueYPt() {
      return splitNumberByDecimal(this.valueY);
    }
  },
  data() {
    return {
      componentKey: 0
    };
  },
  methods: {
    /**
     * Emit position x to parent
     * @param {Number}  val position x value user entered
     */
    onChangeValueX(val) {
      const { isValid, value } = validateInputOption(val, -100, 100, 2);
      if (isValid) {
        this.$emit('change', { coord: { x: value } });
      } else {
        this.componentKey++;
      }
    },
    /**
     * Emit position x value to parent
     * @param {Number}  val position y value user entered
     */
    onChangeValueY(val) {
      const { isValid, value } = validateInputOption(val, -100, 100, 2);
      if (isValid) {
        this.$emit('change', { coord: { y: value } });
      } else {
        this.componentKey++;
      }
    }
  }
};
