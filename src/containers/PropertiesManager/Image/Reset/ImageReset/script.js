import { OBJECT_TYPE } from '@/common/constants';
import PpButton from '@/components/Buttons/Button';
import { useProperties } from '@/hooks';
export default {
  setup() {
    const { getProperty } = useProperties();
    return { getProperty };
  },
  components: {
    PpButton
  },
  computed: {
    disabled() {
      return (
        !this.getProperty('hasImage') ||
        this.getProperty('type') !== OBJECT_TYPE.IMAGE
      );
    }
  },
  methods: {
    /**
     * Emit click crop image event to parent component
     */
    onClickCropImage() {
      if (this.disabled) return;
      this.$emit('onClickCropImage');
    },
    /**
     * Emit click remove image event to parent component
     */
    onClickRemoveImage() {
      if (this.disabled) return;
      this.$emit('onClickRemoveImage');
    }
  }
};
