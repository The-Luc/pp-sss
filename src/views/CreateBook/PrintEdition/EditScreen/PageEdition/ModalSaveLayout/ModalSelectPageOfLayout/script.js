import { mapMutations, mapActions } from 'vuex';

import Modal from '@/containers/Modal';
import PpButton from '@/components/Buttons/Button';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { MODAL_TYPES } from '@/common/constants';

export default {
  components: {
    Modal,
    PpButton
  },
  setup() {},
  computed: {},
  methods: {
    ...mapMutations({
      toggleModal: APP_MUTATES.TOGGLE_MODAL
    }),
    /**
     * Trigger mutation to close modal
     */
    onCancel() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    /**
     * Select page of layout to save layout and open modal set name layout
     */
    onSelectPageOfLayout() {
      this.onCancel();
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.SAVE_LAYOUT
        }
      });
    }
  }
};
