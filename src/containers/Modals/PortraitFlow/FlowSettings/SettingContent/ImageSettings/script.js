import Shadow from '@/components/Properties/Features/Shadow';
import Border from '@/components/Properties/Features/Border';
import { cloneDeep } from 'lodash';

export default {
  components: { Shadow, Border },
  props: {
    imageSettings: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onBorderChange(val) {
      const imageSettings = cloneDeep(this.imageSettings);
      imageSettings.border = {
        ...imageSettings.border,
        ...val
      };
      this.$emit('portraitSettingChange', { imageSettings });
    },
    onShadowChange(val) {
      const imageSettings = cloneDeep(this.imageSettings);
      imageSettings.shadow = {
        ...imageSettings.shadow,
        ...val
      };
      this.$emit('portraitSettingChange', { imageSettings });
    }
  }
};
