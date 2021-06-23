import Send from '@/components/Arrange/Send';
import Size from '@/components/Arrange/Size';
import Position from '@/components/Arrange/Position';
import Flip from '@/components/Arrange/Flip';
import Rotate from '@/components/Arrange/Rotate';

export default {
  components: {
    Send,
    Size,
    Position,
    Flip,
    Rotate
  },
  props: {
    rotateValue: {
      type: Number,
      default: 0
    },
    minSize: {
      type: Number,
      default: 0
    },
    maxSize: {
      type: Number,
      default: 100
    },
    sizeWidth: {
      type: Number,
      default: 0
    },
    sizeHeight: {
      type: Number,
      default: 0
    },
    isConstrain: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    position: {
      type: Object,
      default: () => ({})
    },
    minPosition: {
      type: Number,
      default: 0
    },
    maxPosition: {
      type: Number,
      default: 100
    }
  },
  methods: {
    /**
     * Handle events when user click on "send" buttons
     * @param {String}  actionName indicated which type of "send" button was clicked
     */
    changeZIndex(actionName) {
      this.$root.$emit('changeObjectIdsOrder', actionName);
    },

    /**
     * Emit flip value to parent
     * @param {String}  actionName action name user clicked
     */
    changeFlip(actionName) {
      this.$emit('changeFlip', actionName);
    },
    /**
     * Emit size, position or rotate value to parent
     * @param {Object}  object object containing the value of update size, position or rotate user entered
     */
    onChange(object) {
      this.$emit('change', object);
    },
    /**
     * Emit constrain value to parent
     * @param {Object}  val Constrain value
     */
    onChangeConstrain(val) {
      this.$emit('changeConstrain', val);
    }
  }
};
