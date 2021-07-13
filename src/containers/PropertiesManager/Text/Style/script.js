import Opacity from '@/components/Properties/Features/Opacity';
import Shadow from '@/components/Properties/Features/Shadow';
import Border from '@/components/Properties/Features/Border';

import { EVENT_TYPE } from '@/common/constants/eventType';
import { useTextProperties } from '@/hooks';
import { BORDER_TYPE } from '@/common/constants/borderType';

export default {
  components: {
    Opacity,
    Border,
    Shadow
  },
  setup() {
    const isDigital = !!window.digitalCanvas; // TODO: find another approach
    const { triggerChange, getProperty } = useTextProperties(isDigital);

    return { triggerChange, getProperty };
  },
  data() {
    return {
      borderOptions: BORDER_TYPE
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
    currentShadow() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      return this.getProperty('shadow');
    },
    currentBorder() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      return this.getProperty('border');
    }
  },
  methods: {
    /**
     * Receive value opacity from children
     * @param   {Number}  opacity Value user input
     */
    onChangeOpacity(opacity) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, { opacity });
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
    },
    /**
     * Emit Shadow Config change to root
     * @param {Object} shadowCfg - the new shadow configs
     */
    emitChangeShadow(shadowCfg) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        shadow: {
          ...this.currentShadow,
          ...shadowCfg
        }
      });
    },
    /**
     * Handle update shadow config base on enable/disable of dropShadow
     * @param {Object} Object the value of the shadow will be change
     */
    onChangeDropShadow(object) {
      this.emitChangeShadow(object);
    },
    /**
     * Handle update shadow config after user select shadow value
     * @param {Object} object the value of shadow will be change
     */
    onChangeShadow(object) {
      this.emitChangeShadow(object);
    }
  }
};
