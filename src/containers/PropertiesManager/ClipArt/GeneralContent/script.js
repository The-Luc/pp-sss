import FillColor from '@/containers/Properties/Features/FillColor';
import Opacity from '@/components/Properties/Features/Opacity';
import Shadow from '@/components/Properties/Features/Shadow';

import { useClipArtProperties } from '@/hooks';

import { DEFAULT_PROP } from '@/common/constants';

export default {
  components: {
    FillColor,
    Shadow,
    Opacity
  },
  setup() {
    const {
      getProperty,
      triggerChange,
      setColorPickerData
    } = useClipArtProperties();

    return {
      getProperty,
      triggerChange,
      setColorPickerData
    };
  },
  computed: {
    opacityValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const res = this.getProperty('opacity');

      return !res ? 0 : res;
    },
    colorValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const color = this.getProperty('color') || DEFAULT_PROP.COLOR;

      this.setColorPickerData({ color });

      return color;
    },
    isAllowFillColor() {
      return !this.getProperty('isColorful');
    },
    currentShadow() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      return this.getProperty('shadow');
    }
  },
  methods: {
    /**
     * Emit Shadow Config change to root
     * @param {Object} shadowCfg - the new shadow configs
     */
    emitChangeShadow(shadowCfg) {
      this.$root.$emit('printChangeClipArtProperties', {
        shadow: {
          ...this.currentShadow,
          ...shadowCfg
        }
      });
    },
    /**
     * Handle update shadow config base on enable/disable of dropShadow
     * @param {String} value Value user selected
     */
    onChangeDropShadow(value) {
      this.emitChangeShadow(value);
    },
    /**
     * Handle update shadow config after user select shadow value
     * @param {Object} object the value of shadow will be change
     */
    onChangeShadow(object) {
      this.emitChangeShadow(object);
    },
    /**
     * Receive value opacity from children
     * @param   {Number}  opacity Value user input
     */
    onChangeOpacity(opacity) {
      this.$root.$emit('printChangeClipArtProperties', { opacity });
    },
    /**
     * Receive value opacity from children
     * @param {String}  color value user input
     */
    onChangeColor(color) {
      this.$root.$emit('printChangeClipArtProperties', {
        color,
        stroke: color
      });
    }
  }
};
