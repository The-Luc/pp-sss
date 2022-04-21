import TextFieldProperty from '@/components/Input/TextFieldProperty';

import { splitNumberByDecimal, validateInputOption } from '@/common/utils';

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
      const width = splitNumberByDecimal(val);
      if (width == this.widthPt) {
        this.onEsc();
        return;
      }
      const height = (val * this.height) / this.width;
      const { isValid, value, isForce } = validateInputOption(
        width,
        this.minSize || this.minWidth,
        this.maxSize,
        2
      );

      if (!isValid || (this.isConstrain && height < this.minHeight)) {
        this.forceRenderComponent();
        return;
      }

      this.$emit('change', { size: { width: value } });
      if (isForce) {
        this.forceRenderComponent();
      }
    },

    /**
     * Emit size height value to parent
     * @param {Number}  val size height value user entered
     */
    onChangeHeight(val) {
      const height = splitNumberByDecimal(val);
      if (height == this.heightPt) {
        this.onEsc();
        return;
      }
      const width = (val * this.width) / this.height;
      const { isValid, value, isForce } = validateInputOption(
        height,
        this.minSize || this.minHeight,
        this.maxSize,
        2
      );
      if (!isValid || (this.isConstrain && width < this.minWidth)) {
        this.forceRenderComponent();
        return;
      }

      this.$emit('change', { size: { height: value } });
      if (isForce) {
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
