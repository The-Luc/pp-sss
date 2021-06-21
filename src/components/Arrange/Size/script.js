import { pxToIn } from '@/common/utils';
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
    }
  },
  components: {
    TextFieldProperty
  },
  computed: {
    widthPt() {
      return pxToIn(this.width);
    },
    heightPt() {
      return pxToIn(this.height);
    }
  },
  methods: {
    /**
     * Emit size width value to parent
     * @param {Number}  val size width value user entered
     */
    onChangeWidth(val) {
      this.$emit('change', { size: { width: val } });
    },
    /**
     * Emit size height value to parent
     * @param {Number}  val size height value user entered
     */
    onChangeHeight(val) {
      this.$emit('change', { size: { height: val } });
    },
    /**
     * Emit constrain value to parent
     * @param {Number}  val Constrain value
     */
    onChangeConstrain(val) {
      this.$emit('changeConstrain', val);
    }
  }
};
