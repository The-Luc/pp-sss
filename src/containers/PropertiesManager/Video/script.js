import Properties from '@/components/Properties/BoxProperties';
import ArrangeContent from '@/components/Properties/Groups/Arrange';
import TabPropertiesMenu from '@/containers/TabPropertiesMenu';
import StyleContent from '@/containers/Properties/Groups/General';
import Movie from './Movie';

import { useElementProperties } from '@/hooks';
import { DEFAULT_VIDEO, EVENT_TYPE } from '@/common/constants';
import { computedObjectSize } from '@/common/utils';

export default {
  components: {
    Properties,
    Movie,
    StyleContent,
    ArrangeContent,
    TabPropertiesMenu
  },
  setup() {
    const { getProperty } = useElementProperties();

    return {
      getProperty
    };
  },
  computed: {
    rotateValue() {
      const coord = this.getProperty('coord');
      return coord?.rotation || 0;
    },
    position() {
      const coord = this.getProperty('coord');

      return {
        x: coord?.x || 0,
        y: coord?.y || 0
      };
    },
    minPosition() {
      return DEFAULT_VIDEO.MIN_POSITION;
    },
    maxPosition() {
      return DEFAULT_VIDEO.MAX_POSITION;
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
      return DEFAULT_VIDEO.MIN_SIZE;
    },
    maxSize() {
      return DEFAULT_VIDEO.MAX_SIZE;
    },
    opacityValue() {
      const res = this.getProperty('opacity');
      return !res ? 0 : res;
    },
    currentShadow() {
      return this.getProperty('shadow');
    },
    currentBorder() {
      return this.getProperty('border');
    }
  },
  methods: {
    /**
     * Handle update flip for Video object
     * @param {String} actionName action name
     */
    changeFlip(actionName) {
      const currentFlip = {
        ...this.getProperty('flip')
      };

      this.$root.$emit(EVENT_TYPE.CHANGE_VIDEO_PROPERTIES, {
        flip: { [actionName]: !currentFlip[actionName] }
      });
    },
    /**
     * Handle update size, position or rotate for Video object
     * @param {Object} object object containing the value of update size, position or rotate
     */
    onChange(object) {
      const key = Object.keys(object);
      if (key.includes('size')) {
        const size = computedObjectSize(
          object.size,
          { width: this.sizeWidth, height: this.sizeHeight },
          DEFAULT_VIDEO.MIN_SIZE,
          DEFAULT_VIDEO.MAX_SIZE,
          this.isConstrain
        );
        object.size = size;
      }
      this.$root.$emit(EVENT_TYPE.CHANGE_VIDEO_PROPERTIES, object);
    },

    /**
     * Handle update constrain property
     * @param {Boolean} isConstrain value for isConstrain property
     */
    onChangeConstrain(val) {
      this.$root.$emit(EVENT_TYPE.CHANGE_VIDEO_PROPERTIES, {
        isConstrain: val
      });
    },
    /**
     * Handle update Shadow Config
     * @param {Object} shadowCfg - the new shadow configs
     */
    onChangeShadow(shadowCfg) {
      this.$root.$emit(EVENT_TYPE.CHANGE_VIDEO_PROPERTIES, {
        shadow: {
          ...this.currentShadow,
          ...shadowCfg
        },
        styleId: ''
      });
    },
    /**
     * Handle update border
     * @param {Object} borderCfg Border option selected
     */
    onChangeBorder(borderCfg) {
      this.$root.$emit(EVENT_TYPE.CHANGE_VIDEO_PROPERTIES, {
        border: {
          ...this.currentBorder,
          ...borderCfg
        },
        styleId: ''
      });
    }
  }
};
