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
      const { isValid, value, isForce } = validateInputOption(
        val,
        this.minSize,
        this.maxSize,
        2
      );
      if (isValid) {
        this.$emit('change', { size: { width: value } });
        if (isForce) {
          this.componentKey++;
        }
      } else {
        this.componentKey++;
      }
    },
    /**
     * Emit size height value to parent
     * @param {Number}  val size height value user entered
     */
    onChangeHeight(val) {
      const { isValid, value } = validateInputOption(
        val,
        this.minSize,
        this.maxSize,
        2
      );
      if (isValid) {
        this.$emit('change', { size: { height: value } });
      } else {
        this.componentKey++;
      }
    },
    /**
     * Emit constrain value to parent
     */
    onChangeConstrain() {
      this.$emit('changeConstrain', !this.isConstrain);
    }
  }
};
