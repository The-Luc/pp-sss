import Properties from '@/components/Properties/BoxProperties';
import TabPropertiesMenu from '@/containers/TabPropertiesMenu';
import ArrangeContent from '@/components/Arrange';
import General from '@/components/General';
import ImageStyle from './ImageStyle';
import Reset from './Reset';

import { useElementProperties } from '@/hooks';
import { DEFAULT_IMAGE, EVENT_TYPE, IMAGE_STYLE } from '@/common/constants';
import { computedObjectSize } from '@/common/utils';

export default {
  components: {
    Properties,
    TabPropertiesMenu,
    ArrangeContent,
    General,
    ImageStyle,
    Reset
  },
  setup() {
    const { getProperty } = useElementProperties();

    return {
      getProperty
    };
  },
  data() {
    return {
      imageStyle: IMAGE_STYLE
    };
  },
  computed: {
    rotateValue() {
      const coord = this.getProperty('coord');

      return coord?.rotation || 0;
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
    sizeWidth() {
      const size = this.getProperty('size');

      return size?.width || 0;
    },
    sizeHeight() {
      const size = this.getProperty('size');

      return size?.height || 0;
    },

    minSize() {
      return DEFAULT_IMAGE.MIN_SIZE;
    },
    maxSize() {
      return DEFAULT_IMAGE.MAX_SIZE;
    },
    minPosition() {
      return DEFAULT_IMAGE.MIN_POSITION;
    },
    maxPosition() {
      return DEFAULT_IMAGE.MAX_POSITION;
    },
    opacityValue() {
      const res = this.getProperty('opacity');

      return !res ? 0 : res;
    },
    currentBorder() {
      return this.getProperty('border');
    },
    currentShadow() {
      return this.getProperty('shadow');
    },
    styleSelected() {
      return this.getProperty('styleId');
    }
  },
  methods: {
    /**
     * Handle update flip for Image
     * @param {String} actionName action name
     */
    changeFlip(actionName) {
      const currentFlip = {
        ...this.getProperty('flip')
      };

      this.$root.$emit(EVENT_TYPE.CHANGE_IMAGE_PROPERTIES, {
        flip: { [actionName]: !currentFlip[actionName] }
      });
    },
    /**
     * Handle update size, position or rotate for Image
     * @param {Object} object object containing the value of update size, position or rotate
     */
    onChange(object) {
      const key = Object.keys(object);
      if (key.includes('size')) {
        const size = computedObjectSize(
          object.size,
          { width: this.sizeWidth, height: this.sizeHeight },
          DEFAULT_IMAGE.MIN_SIZE,
          DEFAULT_IMAGE.MAX_SIZE,
          this.isConstrain
        );
        object.size = size;
      }
      this.$root.$emit(EVENT_TYPE.CHANGE_IMAGE_PROPERTIES, object);
    },
    /**
     * Handle constrain proportions for Image
     * @param {Boolean} val
     */
    onChangeConstrain(val) {
      this.$root.$emit(EVENT_TYPE.CHANGE_IMAGE_PROPERTIES, {
        isConstrain: val
      });
    },
    /**
     * Handle update Shadow Config for image
     * @param {Object} shadowCfg - the new shadow configs
     */
    onChangeShadow(shadowCfg) {
      this.$root.$emit(EVENT_TYPE.CHANGE_IMAGE_PROPERTIES, {
        shadow: {
          ...this.currentShadow,
          ...shadowCfg
        }
      });
    },
    /**
     * Get border option selected and emit to image properties
     * @param {Object} borderCfg Border option selected
     */
    onChangeBorder(borderCfg) {
      this.$root.$emit(EVENT_TYPE.CHANGE_IMAGE_PROPERTIES, {
        border: {
          ...this.currentBorder,
          ...borderCfg
        }
      });
    },
    /**
     * Set id's image style to image properties
     * @param {Number} item - selected image style
     */
    onSelectImageStyle(item) {
      this.$root.$emit(EVENT_TYPE.CHANGE_IMAGE_PROPERTIES, {
        ...item?.style,
        styleId: item.id
      });
    },

    /**
     * Handle click crop image for Image
     */
    onClickCropImage() {
      console.log('onClickCropImage');
      //TODO
    },
    /**
     * Handle click remove image for Image
     */
    onClickRemoveImage() {
      console.log('onClickRemoveImage');
      //TODO
    },
    /**
     * Handle click background image for Image
     */
    onClickBackgroundImage() {
      console.log('onClickBackgroundImage');
      //TODO
    }
  }
};
