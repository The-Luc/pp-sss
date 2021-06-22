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
  data() {
    return {
      shadowOptions: [
        {
          name: 'No Shadow',
          value: 'noShadow'
        },
        {
          name: 'Drop Shadow',
          value: 'dropShadow'
        }
      ],
      selectedShadow: {
        name: 'No Shadow',
        value: 'noShadow'
      }
    };
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
    }
  },
  methods: {
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
    },
    /**
     * Receive value shadow from children
     * @param   {Object}  value Value user selecte
     */
    onChangeShadow(value) {
      this.selectedShadow = value;
    }
  }
};
