import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';

import { useActionSection } from '../../composables';

export default {
  components: {
    Modal,
    PpButton
  },
  setup() {
    const { deleteSheet, toggleModal } = useActionSection();

    return { deleteSheet, toggleModal };
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
    onCloseModal() {
      this.toggleModal({ isOpenModal: false });
    },
    onDeleteSheet(sheetId, sectionId) {
      this.deleteSheet(sheetId, sectionId);
    }
  }
};
