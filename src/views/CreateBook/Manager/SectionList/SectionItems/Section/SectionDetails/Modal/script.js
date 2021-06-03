import { mapMutations } from 'vuex';
import { MUTATES } from '@/store/modules/app/const';
import { MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';

import Modal from '@/containers/Modal';
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
    },
    indexSheet() {
      return this.$attrs.props.indexSheet;
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL,
      deleteSheet: BOOK_MUTATES.DELETE_SHEET
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
