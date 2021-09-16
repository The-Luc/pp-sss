import CommonModal from '@/containers/Modals/CommonModal';
import PpButton from '@/components/Buttons/Button';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    CommonModal,
    PpButton
  },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      settingName: ''
    };
  },
  methods: {
    /**
     * trigger when save text or image style
     */
    onSaveSettings() {
      if (isEmpty(this.settingName)) this.settingName = 'Untitled';

      this.$emit('SaveSettings', { name: this.settingName });
      this.settingName = '';
    },
    /**
     * Emit cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
    }
  }
};
