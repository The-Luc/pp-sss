import { mapMutations } from 'vuex';

import { MODAL_TYPES } from '@/common/constants';
import Modal from '@/containers/Modal';
import { MUTATES } from '@/store/modules/app/const';
import { MUTATES as DIGITAL_MUTATES } from '@/store/modules/digital/const';
import PpButton from '@/components/Buttons/Button';

export default {
  components: {
    Modal,
    PpButton
  },
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL,
      triggerApplyLayout: DIGITAL_MUTATES.UPDATE_TRIGGER_APPLY_LAYOUT
    }),

    onAction() {
      this.triggerApplyLayout();
      this.onCancel();
    },

    /**
     * Close modal when click Cancel
     */
    onCancel() {
      this.toggleModal({
        isOpenModal: false,
        modalData: {
          type: MODAL_TYPES.OVERRIDE_LAYOUT
        }
      });
    }
  }
};
