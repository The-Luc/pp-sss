import { mapMutations, mapActions } from 'vuex';

import Modal from '@/containers/Modal';
import PpButton from '@/components/Buttons/Button';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

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
    }
  }
};
