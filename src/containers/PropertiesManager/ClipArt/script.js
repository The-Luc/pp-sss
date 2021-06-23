import Properties from '@/components/Properties/BoxProperties';
import TabMenu from '@/components/TabMenu';
import GeneralContent from './GeneralContent';
import ArrangeContent from '@/components/Arrange';
import { DEFAULT_CLIP_ART, OBJECT_TYPE } from '@/common/constants';
import { useClipArtProperties } from '@/hooks';

export default {
  setup() {
    const {
      triggerChange,
      getProperty,
      setColorPickerData
    } = useClipArtProperties();

    return {
      triggerChange,
      getProperty,
      setColorPickerData
    };
  },
  components: {
    Properties,
    TabMenu,
    GeneralContent,
    ArrangeContent
  },
  data() {
    return {
      minPosition: -100,
      maxPosition: 100
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
     * Handle update flip for Clip Art
     * @param {String} actionName action name
     */
    changeFlip(actionName) {
      const currentFlip = {
        ...this.getProperty('flip')
      };

      this.$root.$emit('printChangeClipArtProperties', {
        flip: { [actionName]: !currentFlip[actionName] }
      });
    },
    /**
     * Handle update size, position or rotate for Clip Art
     * @param {Object} object object containing the value of update size, position or rotate
     */
    onChange(object) {
      this.$root.$emit('printChangeClipArtProperties', object);
    },
    /**
     * Handle constrain proportions for Clip Art
     * @param {Boolean} val
     */
    onChangeConstrain(val) {
      this.$root.$emit('printChangeClipArtProperties', {
        isConstrain: val
      });
    }
  }
};
