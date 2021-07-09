import Opacity from '@/components/Properties/Features/Opacity';
import Shadow from '@/components/Properties/Features/Shadow';
import Border from '@/components/Properties/Features/Border';

import { EVENT_TYPE } from '@/common/constants/eventType';
import { mapGetters } from 'vuex';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';

export default {
  components: {
    Opacity,
    Border,
    Shadow
  },
  props: {
    borderOptions: {
      type: Array,
      required: true
    },
    selectedBorder: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      selectObjectProp: APP_GETTERS.SELECT_PROP_CURRENT_OBJECT,
      triggerChange: APP_GETTERS.TRIGGER_TEXT_CHANGE
    }),
    opacityValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const res = this.selectObjectProp('opacity');
      return !res ? 0 : res;
    },
    currentShadow() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      return this.selectObjectProp('shadow');
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
     * Receive value border from children
     * @param   {Object}  data Value user selecte
     */
    onChangeBorder(data) {
      this.$emit('changeBorderOption', data);
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
