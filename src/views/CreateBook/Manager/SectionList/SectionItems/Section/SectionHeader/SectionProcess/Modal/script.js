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
    sectionId() {
      return this.$attrs.props.sectionId;
    },
    sectionName() {
      return this.$attrs.props.sectionName;
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL,
      deleteSection: BOOK_MUTATES.DELETE_SECTION
    }),
    onCloseModal() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    onDeleteSection(sectionId) {
      this.deleteSection({
        sectionId
      });
      this.onCloseModal();
    }
  }
};
