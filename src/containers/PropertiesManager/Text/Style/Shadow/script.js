import { SHADOW_TYPE, SHADOW_OPTIONS } from '@/common/constants/shadow';
import { DEFAULT_SHADOW } from '@/common/constants/defaultProperty';
import { mapGetters } from 'vuex';
import { GETTERS } from '@/store/modules/book/const';
import Select from '@/components/Select';
import Opacity from '@/components/Property/Opacity';
import Blur from './Settings/Blur';
import Offset from './Settings/Offset';
import ShadowColor from './Settings/Color';
import Angle from './Settings/Angle';

export default {
  components: {
    Select,
    Blur,
    Offset,
    Opacity,
    ShadowColor,
    Angle
  },
  data() {
    return {
      selectedOption: SHADOW_OPTIONS[0]
    };
  },
  watch: {
    dropShadow(val) {
      const newOp = SHADOW_OPTIONS.find(o => {
        if (val) {
          return o.value === SHADOW_TYPE.DROP_SHADOW;
        }
        return o.value === SHADOW_TYPE.NO_SHADOW;
      });

      if (newOp.value !== this.selectedOption.value) {
        this.selectedOption = newOp;
      }
    }
  },
  computed: {
    ...mapGetters({
      selectedObjectId: GETTERS.SELECTED_OBJECT_ID,
      getPropObjectById: GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: GETTERS.TRIGGER_TEXT_CHANGE
    }),
    options() {
      return SHADOW_OPTIONS;
    },
    currentShadow() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      if (!this.selectedObjectId) {
        return null;
      }
      return this.getPropObjectById({
        id: this.selectedObjectId,
        prop: 'shadow'
      });
    },
    dropShadow() {
      return this.currentShadow && this.currentShadow.dropShadow;
    }
  },
  methods: {
    /**
     * Emit Shadow Config change to root
     * @param {Object} shadowCfg - the new shadow configs
     */
    emitChangeShadow(shadowCfg) {
      this.$root.$emit('printChangeTextProperties', {
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
    onChangeDropShadow({ value }) {
      this.emitChangeShadow({
        dropShadow: value === SHADOW_TYPE.DROP_SHADOW,
        shadowBlur: DEFAULT_SHADOW.BLUR,
        shadowOffset: DEFAULT_SHADOW.OFFSET,
        shadowOpacity: DEFAULT_SHADOW.OPACITY,
        shadowAngle: DEFAULT_SHADOW.ANGLE,
        shadowColor: DEFAULT_SHADOW.COLOR
      });
    },
    onChangeBlur(shadowBlur) {
      this.emitChangeShadow({ shadowBlur });
    },
    onChangeOffset(shadowOffset) {
      this.emitChangeShadow({ shadowOffset });
    },
    onChangeOpacity(shadowOpacity) {
      this.emitChangeShadow({ shadowOpacity });
    },
    onChangeAngle(shadowAngle) {
      this.emitChangeShadow({ shadowAngle });
    },
    onChangeColor(shadowColor) {
      this.emitChangeShadow({ shadowColor });
    }
  }
};
