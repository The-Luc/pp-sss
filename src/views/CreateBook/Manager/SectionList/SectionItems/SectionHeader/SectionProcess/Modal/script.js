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
    sectionId() {
      return this.$attrs.props.sectionId;
    },
    sectionName() {
      return this.$attrs.props.sectionName;
    }
  },
  methods: {
    ...mapMutations('project', ['deleteSection']),
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
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
