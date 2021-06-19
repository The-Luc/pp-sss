import { mapMutations, mapGetters } from 'vuex';
import Send from '@/components/Arrange/Send';
import Size from '@/components/Arrange/Size';
import Position from '@/components/Arrange/Position';
import Flip from '@/components/Arrange/Flip';
import Rotate from '@/components/Arrange/Rotate';
import { useObject } from '@/hooks';
import { OBJECT_TYPE } from '@/common/constants';
import { ARRANGE_SEND } from '@/common/constants/arrange';
import { MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';

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
    isConstrain() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const isConstrain = this.selectObjectProp('isConstrain');
      return isConstrain;
    },
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
    }
  },
  methods: {
    ...mapMutations({
      setObjectProp: BOOK_MUTATES.SET_PROP
    }),
    /**
     * Handle events when user click on "send" buttons
     * @param {String}  actionName indicated which type of "send" button was click
     *
     */
    changeZIndex(actionName) {
      const selectedObject = window.printCanvas.getActiveObject();

      if (!selectedObject) return;

      const allObjects = window.printCanvas.getObjects();
      // const index = this.selectObjectProp('zIndex');
      // console.log(index);
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
    }
  }
};
