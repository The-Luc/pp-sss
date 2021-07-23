import color from 'color';
import { SHADOW_TYPE, SHADOW_OPTIONS } from '@/common/constants/shadow';
import { DEFAULT_SHADOW } from '@/common/constants/defaultProperty';
import Select from '@/components/Selectors/Select';
import Opacity from '@/components/Properties/Features/Opacity';
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
  props: {
    currentShadow: {
      type: Object,
      required: false
    }
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
    options() {
      return SHADOW_OPTIONS;
    },
    dropShadow() {
      if (this.currentShadow?.dropShadow) {
        this.selectedOption = SHADOW_OPTIONS[1];
      }
      return this.currentShadow && this.currentShadow.dropShadow;
    }
  },
  methods: {
    /**
     * Emit value shadow config base on enable/disable of dropShadow
     * @param {String} value Value user selected
     */
    onChangeDropShadow({ value }) {
      this.$emit('changeDropShadow', {
        dropShadow: value === SHADOW_TYPE.DROP_SHADOW,
        shadowBlur: DEFAULT_SHADOW.BLUR,
        shadowOffset: DEFAULT_SHADOW.OFFSET,
        shadowOpacity: DEFAULT_SHADOW.OPACITY,
        shadowAngle: DEFAULT_SHADOW.ANGLE,
        shadowColor: DEFAULT_SHADOW.COLOR
      });
    },
    /**
     * Emit value shadow includes blur, offset, angle, color
     * @param {Object} object Value user selected
     */
    onChange(object) {
      if (object?.shadowColor) {
        object.shadowOpacity = color(object.shadowColor).alpha();
      }

      this.$emit('change', object);
    },
    /**
     * Emit value opacity of the shadow
     * @param {Number} value Value user selected
     */
    onChangeOpacity(value) {
      const shadowColor = color(this.currentShadow?.shadowColor)
        .alpha(value)
        .toString();

      this.$emit('change', {
        shadowColor,
        shadowOpacity: value
      });
    }
  }
};
