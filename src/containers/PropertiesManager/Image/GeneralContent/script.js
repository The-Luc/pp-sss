import Opacity from '@/components/Properties/Features/Opacity';
import Shadow from '@/components/Properties/Features/Shadow';
import Border from '@/components/Properties/Features/Border';
import ImageStyle from './ImageStyle';
import imagesStyle from '@/mock/imageStyle';
import { DEFAULT_PROP } from '@/common/constants';
import { SHADOW_OPTIONS } from '@/common/constants/shadow';
import { ImageElement } from '@/common/models';

export default {
  components: {
    Opacity,
    Shadow,
    Border,
    ImageStyle
  },
  data() {
    return {
      selectedBorder: {},
      imagesStyle,
      styleSelected: null
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
      console.log(shadowCfg);
      // TODO
    },
    /**
     * Handle update shadow config base on enable/disable of dropShadow
     * @param {Object} Object the value of the shadow will be change
     */
    onChangeDropShadow(object) {
      console.log(object);
      // TODO
    },
    /**
     * Handle update shadow config after user select shadow value
     * @param {Object} object the value of shadow will be change
     */
    onChangeShadow(object) {
      console.log(object);
      // TODO
    },
    /**
     * Receive value opacity from children
     * @param   {Number}  opacity Value user input
     */
    onChangeOpacity(opacity) {
      this.$root.$emit('printChangeImageProperties', { opacity });
    },
    /**
     * Get border option selected and emit to image properties
     * @param {Object} data Border option selected
     */
    changeBorderOption(data) {
      this.selectedBorder = data;
    },
    /**
     * Set id's image style to image properties
     * @param {Number} id - id's image style
     */
    onSelectImageStyle(id) {
      this.styleSelected = id;
    }
  },
  created() {
    // TODO: update when implement logic
    this.selectedBorder = { ...ImageElement.border };
    this.styleSelected = this.imagesStyle[0].id;
  }
};
