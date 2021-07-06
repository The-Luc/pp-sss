import Properties from '@/components/Properties/BoxProperties';
import TabPropertiesMenu from '@/containers/TabPropertiesMenu';
import ArrangeContent from '@/components/Arrange';
import GeneralContent from './GeneralContent';

import { useShapeProperties } from '@/hooks';
import { computedObjectSize } from '@/common/utils';

import { DEFAULT_SHAPE } from '@/common/constants';

export default {
  components: {
    Properties,
    TabPropertiesMenu,
    GeneralContent,
    ArrangeContent
  },
  setup() {
    const { triggerChange, getProperty } = useShapeProperties();

    return {
      triggerChange,
      getProperty
    };
  },
  computed: {
    rotateValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const coord = this.getProperty('coord');

      return coord?.rotation || 0;
    },
    sizeWidth() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const size = this.getProperty('size');

      return size?.width || 0;
    },
    sizeHeight() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const size = this.getProperty('size');

      return size?.height || 0;
    },
    isConstrain() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      return this.getProperty('isConstrain');
    },
    minSize() {
      return DEFAULT_SHAPE.MIN_SIZE;
    },
    maxSize() {
      return DEFAULT_SHAPE.MAX_SIZE;
    },
    minPosition() {
      return DEFAULT_SHAPE.MIN_POSITION;
    },
    maxPosition() {
      return DEFAULT_SHAPE.MAX_POSITION;
    },
    position() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const coord = this.getProperty('coord');

      return {
        x: coord?.x || 0,
        y: coord?.y || 0
      };
    }
  },
  methods: {
    /**
     * Handle update flip for Shape
     * @param {String} actionName action name
     */
    changeFlip(actionName) {
      const currentFlip = {
        ...this.getProperty('flip')
      };

      this.$root.$emit('printChangeShapeProperties', {
        flip: { [actionName]: !currentFlip[actionName] }
      });
    },
    /**
     * Handle update size, position or rotate for Shape
     * @param {Object} object object containing the value of update size, position or rotate
     */
    onChange(object) {
      const key = Object.keys(object);
      if (key.includes('size')) {
        const size = computedObjectSize(
          object.size,
          { width: this.sizeWidth, height: this.sizeHeight },
          DEFAULT_SHAPE.MIN_SIZE,
          DEFAULT_SHAPE.MAX_SIZE,
          this.isConstrain
        );
        object.size = size;
      }
      this.$root.$emit('printChangeShapeProperties', object);
    },
    onChangeConstrain(val) {
      this.$root.$emit('printChangeShapeProperties', {
        isConstrain: val
      });
    }
  }
};
