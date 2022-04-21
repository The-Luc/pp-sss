import PpButton from '@/components/Buttons/Button';
import { ASSET_TYPE } from '@/common/constants';

export default {
  components: {
    PpButton
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    modalType: {
      type: String,
      default: 'Media'
    },
    deleteType: {
      type: String,
      default: ASSET_TYPE.VIDEO
    }
  },
  computed: {
    isVideo() {
      return this.deleteType === ASSET_TYPE.VIDEO;
    }
  },
  methods: {
    /**
     * Trigger when click remove button
     */
    onRemove() {
      this.$emit('remove');
    },
    /**
     * Trigger when click cancel button
     */
    onCancel() {
      this.$emit('cancel');
    }
  }
};
