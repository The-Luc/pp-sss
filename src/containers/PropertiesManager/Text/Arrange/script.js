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
      console.log('event', event);
    }
  }
};
