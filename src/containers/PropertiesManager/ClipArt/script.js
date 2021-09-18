import Properties from '@/components/Properties/BoxProperties';
import ArrangeContent from '@/components/Properties/Groups/Arrange';
import GeneralContent from '@/containers/Properties/Groups/General';
import TabPropertiesMenu from '@/containers/TabPropertiesMenu';

import { useElementProperties, useAppCommon } from '@/hooks';
import { computedObjectSize } from '@/common/utils';

import {
  DEFAULT_CLIP_ART,
  DEFAULT_PROP,
  OBJECT_TYPE,
  EVENT_TYPE
} from '@/common/constants';

export default {
  setup() {
    const { getProperty } = useElementProperties();
    const { isDigitalEdition } = useAppCommon();

    return {
      getProperty,
      isDigitalEdition
    };
  },
  components: {
    Properties,
    TabPropertiesMenu,
    GeneralContent,
    ArrangeContent
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
    position() {
      const coord = this.getProperty('coord');

      return {
        x: coord?.x || 0,
        y: coord?.y || 0
      };
    },
    size() {
      const size = this.getProperty('size');
      return {
        width: size?.width || 0,
        height: size?.height || 0
      };
    },
    minSize() {
      return DEFAULT_CLIP_ART.MIN_SIZE;
    },
    maxSize() {
      return 60;
    },
    minPosition() {
      return DEFAULT_CLIP_ART.MIN_POSITION;
    },
    maxPosition() {
      return DEFAULT_CLIP_ART.MAX_POSITION;
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
    isAllowFillColor() {
      return !this.getProperty('isColorful');
    }
  },
  methods: {
    /**
     * Handle update flip for Clip Art
     * @param {String} actionName action name
     */
    changeFlip(actionName) {
      const currentFlip = {
        ...this.getProperty('flip')
      };

      this.$root.$emit(EVENT_TYPE.CHANGE_CLIPART_PROPERTIES, {
        flip: { [actionName]: !currentFlip[actionName] }
      });
    },
    /**
     * Handle update size, position or rotate for Clip Art
     * @param {Object} object object containing the value of update size, position or rotate
     */
    onChange(object) {
      const key = Object.keys(object);
      if (key.includes('size')) {
        const size = computedObjectSize(
          object.size,
          { width: this.sizeWidth, height: this.sizeHeight },
          DEFAULT_CLIP_ART.MIN_SIZE,
          DEFAULT_CLIP_ART.MAX_SIZE,
          this.isConstrain
        );
        object.size = size;
      }
      this.$root.$emit(EVENT_TYPE.CHANGE_CLIPART_PROPERTIES, object);
    },
    /**
     * Handle constrain proportions for Clip Art
     * @param {Boolean} val
     */
    onChangeConstrain(val) {
      this.$root.$emit(EVENT_TYPE.CHANGE_CLIPART_PROPERTIES, {
        isConstrain: val
      });
    },
    /**
     * Handle update Shadow Config for Clip Art
     * @param {Object} shadowCfg - the new shadow configs
     */
    onChangeShadow(shadowCfg) {
      this.$root.$emit(EVENT_TYPE.CHANGE_CLIPART_PROPERTIES, {
        shadow: {
          ...this.currentShadow,
          ...shadowCfg
        }
      });
    },
    onApplyAnimation(val) {
      this.$root.$emit(EVENT_TYPE.APPLY_ANIMATION, {
        objectType: OBJECT_TYPE.CLIP_ART,
        ...val
      });
    },
    /**
     * Emit preview option selected object
     * @param {Object} animationConfig preview option
     */
    onClickPreview(config) {
      this.$root.$emit(EVENT_TYPE.PREVIEW_ANIMATION, config);
    },
    /**
     * Handle change object's animation order
     * @param {Number} order animation order
     */
    onChangeOrder(order) {
      this.$root.$emit(EVENT_TYPE.CHANGE_ANIMATION_ORDER, order);
    }
  }
};
