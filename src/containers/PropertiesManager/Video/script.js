import Properties from '@/components/Properties/BoxProperties';
import TabPropertiesMenu from '@/containers/TabPropertiesMenu';
import Movie from './Movie';
import StyleContent from '@/components/General';
import ArrangeContent from '@/components/Arrange';

import { useElementProperties } from '@/hooks';
import { DEFAULT_IMAGE } from '@/common/constants';

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
      return DEFAULT_IMAGE.MIN_POSITION;
    },
    maxPosition() {
      return DEFAULT_IMAGE.MAX_POSITION;
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
    maxSize() {
      return DEFAULT_IMAGE.MAX_SIZE;
    },
    minWidth() {
      return this.getProperty('minWidth') || DEFAULT_IMAGE.MIN_SIZE;
    },
    minHeight() {
      return this.getProperty('minHeight') || DEFAULT_IMAGE.MIN_SIZE;
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
      // handle flip
      console.log('flip video');
      console.log(actionName);
    },
    /**
     * Handle update size, position or rotate for Video object
     * @param {Object} object object containing the value of update size, position or rotate
     */
    onChange(object) {
      console.log('on change props');
      console.log(object);
    },

    /**
     * Handle update constrain property
     * @param {Boolean} isConstrain value for isConstrain property
     */
    onChangeConstrain(isConstrain) {
      console.log('on change constrain');
      console.log(isConstrain);
    },
    /**
     * Handle update Shadow Config
     * @param {Object} shadowCfg - the new shadow configs
     */
    onChangeShadow(shadowCfg) {
      console.log('on update shadow');
      console.log(shadowCfg);
    },
    /**
     * Handle update border
     * @param {Object} borderCfg Border option selected
     */
    onChangeBorder(borderCfg) {
      console.log('on update border');
      console.log(borderCfg);
    }
  }
};
