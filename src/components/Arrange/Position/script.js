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
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
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
      componentKey: true
    };
  },
  methods: {
    /**
     * Emit position x to parent
     * @param {Number}  val position x value user entered
     */
    onChangeValueX(val) {
      const valueX = splitNumberByDecimal(val);
      if (valueX == this.valueXPt) {
        this.onEsc();
        return;
      }
      const { isValid, value, isForce } = validateInputOption(
        valueX,
        this.min,
        this.max,
        2
      );
      if (isValid) {
        this.$emit('change', { coord: { x: value } });
        if (isForce) {
          this.forceRenderComponent();
        }
      } else {
        this.forceRenderComponent();
      }
    },
    /**
     * Emit position y value to parent
     * @param {Number}  val position y value user entered
     */
    onChangeValueY(val) {
      const valueY = splitNumberByDecimal(val);
      if (valueY == this.valueYPt) {
        this.onEsc();
        return;
      }
      const { isValid, value, isForce } = validateInputOption(
        valueY,
        this.min,
        this.max,
        2
      );
      if (isValid) {
        this.$emit('change', { coord: { y: value } });
        if (isForce) {
          this.forceRenderComponent();
        }
      } else {
        this.forceRenderComponent();
      }
    },
    /**
     * Trigger render component by increase component key
     * Maybe improve later for performance
     */
    forceRenderComponent() {
      this.componentKey = !this.componentKey;
    },
    /**
     * Revert to previous data and un focus input element
     */
    onEsc() {
      this.forceRenderComponent();
    }
  }
};
