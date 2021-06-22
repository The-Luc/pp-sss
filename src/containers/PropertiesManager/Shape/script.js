import Properties from '@/components/Properties/BoxProperties';
import TabMenu from '@/components/TabMenu';
import ArrangeContent from '@/components/Arrange';
import GeneralContent from './GeneralContent';

import { cloneDeep } from 'lodash';

import { useShapeProperties } from '@/hooks';

import { DEFAULT_SHAPE } from '@/common/constants';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    Properties,
    TabMenu,
    GeneralContent,
    ArrangeContent
  },
  setup() {
    const {
      triggerChange,
      getProperty,
      setColorPickerData
    } = useShapeProperties();

    return {
      triggerChange,
      getProperty,
      setColorPickerData
    };
  },
  computed: {
    positionValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const coord = this.getProperty('coord');

      return {
        x: coord?.x || 0,
        y: coord?.y || 0
      };
    },
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
      return 60;
    }
  },
  methods: {
    /**
     * Close color picker (if opening) when change tab
     */
    onChangeTabMenu(data) {
      this.setColorPickerData({
        tabActive: data
      });
    },
    /**
     * Handle update flip for Shape
     * @param {String} actionName action name
     */
    changeFlip(actionName) {
      const flipData = {};

      console.log(actionName);
      this.$root.$emit('printChangeShapeProperties', actionName);
    },
    /**
     * Handle update size, position or rotate for Shape
     * @param {Object} object object containing the value of update size, position or rotate
     */
    onChange(object) {
      const data = cloneDeep(object);

      if (Object.keys(data).includes('size')) {
        data.size = {
          ...(data?.size?.width && { width: data.size.width }),
          ...(data?.size?.height && { height: data.size.height })
        };
      }

      this.$root.$emit('printChangeShapeProperties', data);
    },
    onChangeConstrain(val) {
      this.$root.$emit('printChangeShapeProperties', {
        isConstrain: val
      });
    }
  }
};
