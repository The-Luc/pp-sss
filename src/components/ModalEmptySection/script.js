import { mapMutations } from 'vuex';
import Modal from '@/components/Modal';
import PpButton from '@/components/Button';
import { MUTATES } from '@/store/modules/app/const';
import { SCREEN } from '@/common/constants/book';

export default {
  components: {
    Modal,
    PpButton
  },
  computed: {
    sections() {
      return this.$attrs.props.sections;
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    onChangeView() {
      let currentUrl = this.$router.history.current.fullPath;
      if (currentUrl !== SCREEN.MANAGER) {
        this.$router.push(SCREEN.MANAGER);
      }
      this.toggleModal({
        isOpenModal: false
      });
    }
  }
};
