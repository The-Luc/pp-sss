import Send from '@/components/Arrange/Send';
import Size from '@/components/Arrange/Size';
import Position from '@/components/Arrange/Position';
import Flip from '@/components/Arrange/Flip';
import Rotate from '@/components/Arrange/Rotate';
import { OBJECT_TYPE } from '@/common/constants';
import { ARRANGE_SEND } from '@/common/constants/arrange';

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
      const selectedObject = window.printCanvas.getActiveObject();

      if (!selectedObject) return;

      const allObjects = window.printCanvas.getObjects();
      const hasBackground = allObjects[0].objectType === OBJECT_TYPE.BACKGROUND;
      let numOfBackground = 0;

      if (hasBackground) {
        numOfBackground =
          allObjects[1].objectType === OBJECT_TYPE.BACKGROUND ? 2 : 1;
      }

      const selectedObjectIndex = allObjects.indexOf(selectedObject);

      switch (actionName) {
        case ARRANGE_SEND.BACK:
          selectedObject.moveTo(hasBackground ? numOfBackground : 0);
          break;

        case ARRANGE_SEND.FRONT:
          selectedObject.bringToFront();
          break;

        case ARRANGE_SEND.BACKWARD:
          if (hasBackground) {
            selectedObjectIndex > numOfBackground &&
              selectedObject.sendBackwards();
            break;
          }
          selectedObject.sendBackwards();
          break;

        case ARRANGE_SEND.FORWARD:
          selectedObject.bringForward();
          break;
      }

      // update to objects in strore and fabric objects
      this.$root.$emit('updateZIndexToStore');
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
