import { splitNumberByDecimal, validateInputOption } from '@/common/utils';
import TextFieldProperty from '@/components/TextFieldProperty';
export default {
  props: {
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    isConstrain: {
      type: Boolean,
      default: false
    },
    minSize: {
      type: Number,
      default: 0
    },
    maxSize: {
      type: Number,
      default: 100
    },
    minWidth: {
      type: Number,
      default: 0
    },
    minHeight: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    TextFieldProperty
  },
  computed: {
    widthPt() {
      return splitNumberByDecimal(this.width);
    },
    heightPt() {
      return splitNumberByDecimal(this.height);
    }
  },
  data() {
    return {
      componentKey: 0
    };
  },
  methods: {
    /**
     * Emit size width value to parent
     * @param {Number}  val size width value user entered
     */
    onChangeWidth(val) {
      if (val == this.widthPt) {
        this.onEsc();
        return;
      }
      const { isValid, value, isForce } = validateInputOption(
        val,
        this.minSize || this.minWidth,
        this.maxSize,
        2
      );
      if (isValid) {
        this.$emit('change', { size: { width: value } });
        if (isForce) {
          this.forceRenderComponent();
        }
      } else {
        this.forceRenderComponent();
      }
    },
    /**
     * Emit size height value to parent
     * @param {Number}  val size height value user entered
     */
    onChangeHeight(val) {
      if (val == this.heightPt) {
        this.onEsc();
        return;
      }
      const { isValid, value } = validateInputOption(
        val,
        this.minSize || this.minHeight,
        this.maxSize,
        2
      );
      if (isValid) {
        this.$emit('change', { size: { height: value } });
      } else {
        this.forceRenderComponent();
      }
    },
    /**
     * Emit constrain value to parent
     */
    onChangeConstrain() {
      this.$emit('changeConstrain', !this.isConstrain);
    },
    /**
     * Trigger render component by increase component key
     * Maybe improve later for performance
     */
    forceRenderComponent() {
      this.componentKey += 1;
    },
    /**
     * Revert to previous data and un focus input element
     */
    onEsc() {
      this.forceRenderComponent();
    }
  }
};
