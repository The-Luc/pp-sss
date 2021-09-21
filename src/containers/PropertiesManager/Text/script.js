import Properties from '@/components/Properties/BoxProperties';
import ArrangeContent from '@/components/Properties/Groups/Arrange';
import StyleContent from '@/containers/Properties/Groups/General';
import TabPropertiesMenu from '@/containers/TabPropertiesMenu';
import GeneralContent from './GeneralContent';

import { computedObjectSize, getActiveCanvas } from '@/common/utils';
import { useElementProperties } from '@/hooks';

import { DEFAULT_TEXT, EVENT_TYPE } from '@/common/constants';

export default {
  components: {
    Properties,
    GeneralContent,
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
    disabled() {
      const activeObj = getActiveCanvas()?.getActiveObject();

      return !!activeObj?.isEditing;
    },
    position() {
      const coord = this.getProperty('coord');

      return {
        x: coord?.x || 0,
        y: coord?.y || 0
      };
    },
    minPosition() {
      return DEFAULT_TEXT.MIN_POSITION;
    },
    maxPosition() {
      return DEFAULT_TEXT.MAX_POSITION;
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
      return DEFAULT_TEXT.MAX_SIZE;
    },
    minWidth() {
      return this.getProperty('minWidth') || DEFAULT_TEXT.MIN_SIZE;
    },
    minHeight() {
      return this.getProperty('minHeight') || DEFAULT_TEXT.MIN_SIZE;
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
     * Handle update flip for Text object
     * @param {String} actionName action name
     */
    changeFlip(actionName) {
      const flip = this.getProperty('flip');
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        flip: {
          [actionName]: !flip[actionName]
        }
      });
    },
    /**
     * Handle update size, position or rotate for Text object
     * @param {Object} object object containing the value of update size, position or rotate
     */
    onChange(object) {
      const key = Object.keys(object);
      if (key.includes('size')) {
        const size = computedObjectSize(
          object.size,
          { width: this.sizeWidth, height: this.sizeHeight },
          DEFAULT_TEXT.MIN_SIZE,
          DEFAULT_TEXT.MAX_SIZE,
          this.isConstrain
        );
        object.size = size;
      }
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, object);
    },

    /**
     * Handle update constrain property for Text object
     * @param {Boolean} isConstrain value for isConstrain property of Text object
     */
    onChangeConstrain(isConstrain) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        isConstrain
      });
    },
    /**
     * Handle update Shadow Config for text
     * @param {Object} shadowCfg - the new shadow configs
     */
    onChangeShadow(shadowCfg) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        shadow: {
          ...this.currentShadow,
          ...shadowCfg
        }
      });
    },
    /**
     * Get border option selected and emit to text properties
     * @param {Object} borderCfg Border option selected
     */
    onChangeBorder(borderCfg) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        border: {
          ...this.currentBorder,
          ...borderCfg
        }
      });
    }
  }
};
