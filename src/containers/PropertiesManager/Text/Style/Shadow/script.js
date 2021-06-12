import Select from '@/components/Select';
import Blur from './Settings/Blur';
import Offset from './Settings/Offset';
import Opacity from './Settings/Opacity';
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
    selectedShadow: {
      type: Object,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  computed: {
    blurValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      return 10;
    },
    offsetValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      return 10;
    },
    opacityValue() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      return 10;
    }
  },
  data() {
    return {
      isShowShadow: false
    };
  },
  watch: {
    selectedShadow: {
      deep: true,
      handler(shadow) {
        this.isShowShadow = shadow.value === 'dropShadow';
      }
    }
  },
  methods: {
    /**
     * Emit shadow value to parent
     * @param   {Object}  value Value user selected
     */
    onChange(value) {
      this.$emit('change', value);
    },
    onChangeBlur(value) {
      console.log(value);
    },
    onChangeOffset(value) {
      console.log(value);
    },
    onChangeOpacity(value) {
      console.log(value);
    }
  }
};
