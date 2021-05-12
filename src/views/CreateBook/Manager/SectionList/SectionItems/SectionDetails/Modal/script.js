import { mapMutations } from 'vuex';
import { MUTATES } from '@/store/modules/app/const';

import Modal from '@/components/Modal';
import PpButton from '@/components/Button';

export default {
  components: {
    Modal,
    PpButton
  },
  computed: {
    idSheet() {
      return this.$attrs.props.idSheet;
    },
    idSection() {
      return this.$attrs.props.idSection;
    }
  },
  methods: {
    ...mapMutations('book', ['deleteSheet']),
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    onCloseModal() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    onDeleteSheet(idSheet, idSection) {
      this.deleteSheet({ idSheet, idSection });
      this.onCloseModal();
    }
  }
};
