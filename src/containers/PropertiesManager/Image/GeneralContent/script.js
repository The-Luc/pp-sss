import FillColor from '@/containers/Properties/Features/FillColor';
import Opacity from '@/components/Properties/Features/Opacity';
import Shadow from '@/components/Properties/Features/Shadow';
import Border from '@/components/Properties/Features/Border';

import { DEFAULT_PROP } from '@/common/constants';
import { SHADOW_OPTIONS } from '@/common/constants/shadow';
export default {
  components: {
    FillColor,
    Opacity,
    Shadow,
    Border
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
      }
    };
  },
  computed: {
    opacityValue() {
      return 1;
    },
    colorValue() {
      return DEFAULT_PROP.COLOR;
    },
    currentShadow() {
      return SHADOW_OPTIONS[0];
    }
  },
  methods: {
    /**
     * Emit Shadow Config change to root
     * @param {Object} shadowCfg - the new shadow configs
     */
    emitChangeShadow(shadowCfg) {
      // this.$root.$emit('printChangeImageProperties', {
      //   shadow: {
      //     ...this.currentShadow,
      //     ...shadowCfg
      //   }
      // });
    },
    /**
     * Handle update shadow config base on enable/disable of dropShadow
     * @param {Object} Object the value of the shadow will be change
     */
    onChangeDropShadow(object) {
      // this.emitChangeShadow(object);
    },
    /**
     * Handle update shadow config after user select shadow value
     * @param {Object} object the value of shadow will be change
     */
    onChangeShadow(object) {
      // this.emitChangeShadow(object);
    },
    /**
     * Receive value opacity from children
     * @param   {Number}  opacity Value user input
     */
    onChangeOpacity(opacity) {
      this.$root.$emit('printChangeImageProperties', { opacity });
    },
    changeBorderOption(data) {
      // const border = {
      //   isBorder: data.value !== 'noBorder',
      //   stroke: DEFAULT_TEXT.BORDER.STROKE,
      //   strokeDashArray: DEFAULT_TEXT.BORDER.STROKE_DASH_ARRAY,
      //   strokeLineCap: DEFAULT_TEXT.BORDER.STROKE_LINE_CAP,
      //   strokeWidth:
      //     data.value === 'noBorder' ? DEFAULT_TEXT.BORDER.STROKE_WIDTH : 1
      // };
      // this.$root.$emit('printChangeTextProperties', {
      //   border
      // });
      this.selectedBorder = data;
    }
  }
};
