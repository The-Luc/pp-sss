import { mapMutations } from 'vuex';

import { ICON_LOCAL, MODAL_TYPES } from '@/common/constants';
import Modal from '@/containers/Modal';
import { MUTATES } from '@/store/modules/app/const';

export default {
  components: {
    Modal
  },
  data() {
    return {
      isOpen: false
    };
  },
  created() {
    this.ICON_LOCAL = ICON_LOCAL;
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    openModal() {
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.HELP
        }
      });
    }
  }
};
