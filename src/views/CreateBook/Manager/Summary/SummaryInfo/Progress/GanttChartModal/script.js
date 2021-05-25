import { mapMutations } from 'vuex';

import Timeline from './Timeline';
import Content from './Content';

import { MUTATES } from '@/store/modules/app/const';

import Modal from '@/components/Modal';

export default {
  components: {
    Modal,
    Timeline,
    Content
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
