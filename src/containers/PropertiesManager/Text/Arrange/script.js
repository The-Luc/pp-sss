import Send from '@/components/Arrange/Send';
import Size from '@/components/Arrange/Size';
import Position from '@/components/Arrange/Position';
import Flip from '@/components/Arrange/Flip';
import Rotate from '@/components/Arrange/Rotate';
import { useObject } from '@/hooks';
import { OBJECT_TYPE } from '@/common/constants';

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
  computed: {
    size() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const res = this.selectObjectProp('size');
      return {
        width: res?.width || 0,
        height: res?.height || 0
      };
    },
    isConstrain() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const isConstrain = this.selectObjectProp('isConstrain');
      return isConstrain;
    }
  },
  methods: {
    onClick(event) {
      const selectedObject = window.printCanvas.getActiveObject();

      if (!selectedObject) return;

      const allObjects = window.printCanvas.getObjects();
      // const index = this.selectObjectProp('zIndex');
      // console.log(index);
      const hasBackground = allObjects[0].objectType === OBJECT_TYPE.BACKGROUND;
      const selectedObjectIndex = allObjects.findIndex(
        obj => obj === selectedObject
      );
      // const canSendBack
      switch (event) {
        case 'toBack':
          selectedObject.moveTo(hasBackground ? 1 : 0);
          break;

        case 'toFront':
          selectedObject.bringToFront();
          break;

        case 'backward':
          selectedObjectIndex > 1 && selectedObject.sendBackwards();
          break;

        case 'forward':
          selectedObject.bringForward();
          break;
      }
    }
  }
};
