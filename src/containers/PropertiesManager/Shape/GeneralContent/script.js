import FillColor from '@/containers/Properties/Features/FillColor';
import Opacity from '@/components/Properties/Features/Opacity';
import Border from '@/components/Properties/Features/Border';
import Shadow from '@/components/Properties/Features/Shadow';

import { useShapeProperties } from '@/hooks';

import { DEFAULT_PROP } from '@/common/constants';

export default {
  components: {
    FillColor,
    Opacity,
    Border,
    Shadow
  },
  data() {
    return {
      borderOptions: [
        {
          name: 'No border',
          value: 'noBorder'
        },
        {
          name: 'Line',
          value: 'line'
        }
      ],
      selectedBorder: {
        name: 'No border',
        value: 'noBorder'
      },
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
    } = useShapeProperties();

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

      this.setColorPickerData({ color: color });

      return color;
    }
  },
  methods: {
    /**
     * Receive value opacity from children
     * @param   {Number}  opacity Value user input
     */
    onChangeOpacity(opacity) {
      this.$root.$emit('printChangeShapeProperties', { opacity });
    },
    /**
     * Receive value opacity from children
     * @param {String}  color value user input
     */
    onChangeColor(color) {
      this.$root.$emit('printChangeShapeProperties', { color, stroke: color });
    }
  }
};
