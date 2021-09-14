import PpShadow from '@/components/Properties/Features/Shadow';
import PpBorder from '@/components/Properties/Features/Border';
import MaskSelect from './MaskSelect';
import { cloneDeep } from 'lodash';
import { CSS_PORTRAIT_IMAGE_MASK } from '@/common/constants';

export default {
  components: { PpShadow, PpBorder, MaskSelect },
  props: {
    imageSettings: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    maskOptions() {
      return Object.values(CSS_PORTRAIT_IMAGE_MASK);
    },
    selectedMask() {
      return (
        this.maskOptions.find(item => item.value === this.imageSettings.mask) ||
        {}
      );
    }
  },
  methods: {
    /**
     * Border change and emit
     * @param  {Object} val value of border
     */
    onBorderChange(val) {
      const imageSettings = cloneDeep(this.imageSettings);
      imageSettings.border = {
        ...imageSettings.border,
        ...val
      };
      this.$emit('portraitSettingChange', { imageSettings });
    },
    /**
     * Shadow change and emit
     * @param  {Object} val value of shadow
     */
    onShadowChange(val) {
      const imageSettings = cloneDeep(this.imageSettings);
      imageSettings.shadow = {
        ...imageSettings.shadow,
        ...val
      };
      this.$emit('portraitSettingChange', { imageSettings });
    },
    /**
     * Image mask change and emit
     * @param  {Number} val selected option
     */
    onMaskChange(val) {
      const imageSettings = cloneDeep(this.imageSettings);
      imageSettings.mask = val;
      this.$emit('portraitSettingChange', { imageSettings });
    }
  }
};
