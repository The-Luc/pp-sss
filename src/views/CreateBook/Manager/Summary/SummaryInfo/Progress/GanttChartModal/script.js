import { mapMutations } from 'vuex';

import Timeline from './Timeline';
import BlockBar from '@/components/BlockBar';

import { MUTATES } from '@/store/modules/app/const';

import Modal from '@/components/Modal';

export default {
  components: {
    Modal,
    Timeline,
    BlockBar
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    /**
     * onCloseModal - Close modal by trigger the mutation with payload
     */
    onCloseModal() {
      this.toggleModal({
        isOpenModal: false
      });
    }
  }
};
