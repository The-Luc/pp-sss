import Properties from '@/components/Properties/BoxProperties';
import TabPropertiesMenu from '@/containers/TabPropertiesMenu';
import ArrangeContent from '@/components/Arrange';
import GeneralContent from '@/components/General';
import { DEFAULT_CLIP_ART, DEFAULT_PROP } from '@/common/constants';
import { useClipArtProperties } from '@/hooks';
import { computedObjectSize } from '@/common/utils';
import { EVENT_TYPE } from '@/common/constants/eventType';

export default {
  setup() {
    const { triggerChange, getProperty } = useClipArtProperties();

    return {
      triggerChange,
      getProperty
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
    position() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const coord = this.getProperty('coord');

      return {
        x: coord?.x || 0,
        y: coord?.y || 0
      };
    },
    size() {
      if (this.triggerChange) {
        // just for trigger the change
      }
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
    }
  }
};
