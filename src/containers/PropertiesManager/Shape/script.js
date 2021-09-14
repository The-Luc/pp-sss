import Properties from '@/components/Properties/BoxProperties';
import TabPropertiesMenu from '@/containers/TabPropertiesMenu';
import ArrangeContent from '@/components/Properties/Groups/Arrange';
import GeneralContent from '@/components/Properties/Groups/General';

import { useElementProperties, useAppCommon } from '@/hooks';
import { computedObjectSize } from '@/common/utils';

import { DEFAULT_SHAPE, DEFAULT_PROP } from '@/common/constants';
import { EVENT_TYPE } from '@/common/constants/eventType';

export default {
  components: {
    Properties,
    TabPropertiesMenu,
    GeneralContent,
    ArrangeContent
  },
  setup() {
    const { getProperty } = useElementProperties();
    const { isDigitalEdition } = useAppCommon();

    return {
      getProperty,
      isDigitalEdition
    };
  },
  computed: {
    rotateValue() {
      const coord = this.getProperty('coord');

      return coord?.rotation || 0;
    },
    sizeWidth() {
      const size = this.getProperty('size');

      return size?.width || 0;
    },
    sizeHeight() {
      const size = this.getProperty('size');

      return size?.height || 0;
    },
    isConstrain() {
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
      const coord = this.getProperty('coord');

      return {
        x: coord?.x || 0,
        y: coord?.y || 0
      };
    },
    opacityValue() {
      const res = this.getProperty('opacity');

      return !res ? 0 : res;
    },
    colorValue() {
      const color = this.getProperty('color') || DEFAULT_PROP.COLOR;

      return color;
    },
    currentShadow() {
      return this.getProperty('shadow');
    },
    playInConfig() {
      return this.getProperty('animationIn') || {};
    },
    playOutConfig() {
      return this.getProperty('animationOut') || {};
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

      this.$root.$emit(EVENT_TYPE.CHANGE_SHAPE_PROPERTIES, {
        flip: { [actionName]: !currentFlip[actionName] }
      });
    },
    /**
     * Handle update properties for Shape
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
      this.$root.$emit(EVENT_TYPE.CHANGE_SHAPE_PROPERTIES, object);
    },
    /**
     * Handle constrain proportions for shape
     * @param {Boolean} val
     */
    onChangeConstrain(val) {
      this.$root.$emit(EVENT_TYPE.CHANGE_SHAPE_PROPERTIES, {
        isConstrain: val
      });
    },
    /**
     * Handle update Shadow Config for shape
     * @param {Object} shadowCfg - the new shadow configs
     */
    onChangeShadow(shadowCfg) {
      this.$root.$emit(EVENT_TYPE.CHANGE_SHAPE_PROPERTIES, {
        shadow: {
          ...this.currentShadow,
          ...shadowCfg
        }
      });
    },
    onApplyAnimation(val) {
      console.log(val);
      //  will be implement soon
    }
  }
};
