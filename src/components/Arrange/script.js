import Send from '@/components/Arrange/Send';
import Size from '@/components/Arrange/Size';
import Position from '@/components/Arrange/Position';
import Flip from '@/components/Arrange/Flip';
import Rotate from '@/components/Arrange/Rotate';
import { useObject } from '@/hooks';

export default {
  setup() {
    const { selectObjectProp, triggerChange } = useObject();
    return {
      selectObjectProp,
      triggerChange
    };
  },
  components: {
    Send,
    Size,
    Position,
    Flip,
    Rotate
  },
  props: {
    currentArrange: {
      type: Object,
      default: {}
    },
    minRotate: {
      type: Number,
      required: true
    },
    maxRotate: {
      type: Number,
      required: true
    }
  },
  computed: {
    sizeWidth() {
      return this.currentArrange.size?.width;
    },
    sizeHeight() {
      return this.currentArrange.size?.height;
    },
    positionX() {
      return this.currentArrange.coord?.x;
    },
    positionY() {
      return this.currentArrange.coord?.y;
    },
    valueRotate() {
      return this.currentArrange.coord?.rotation;
    },
    isConstrain() {
      return this.currentArrange.isConstrain;
    }
  },
  methods: {
    /**
     * Emit z-index value to parent
     * @param {String}  actionName action name user clicked
     */
    changeZIndex(actionName) {
      this.$emit('changeZIndex', actionName);
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
