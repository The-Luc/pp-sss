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
  methods: {
    /**
     * Emit position x to parent
     * @param {Number}  val position y value user entered
     */
    onChangeValueX(val) {
      this.$emit('change', { position: { x: val } });
    },
    /**
     * Emit position x value to parent
     * @param {Number}  val position x value user entered
     */
    onChangeValueY(val) {
      this.$emit('change', { position: { y: val } });
    }
  }
};
