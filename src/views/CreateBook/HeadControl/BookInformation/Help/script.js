import { mapMutations } from 'vuex';

import ICON_LOCAL from '@/common/constants/icon';
import Modal from '@/components/Modal';
import { MUTATES } from '@/store/modules/app/const';
import { MODAL_TYPES } from '@/common/constants';

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
