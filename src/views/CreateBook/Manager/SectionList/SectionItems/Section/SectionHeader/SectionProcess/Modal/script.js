import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';

import { useActionSection } from '../../../composables';

export default {
  components: {
    Modal,
    PpButton
  },
  setup() {
    const { deleteSection, toggleModal } = useActionSection();

    return { deleteSection, toggleModal };
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
    onCloseModal() {
      this.toggleModal({ isOpenModal: false });
    },
    onDeleteSection(sectionId) {
      this.deleteSection(sectionId);
    }
  }
};
