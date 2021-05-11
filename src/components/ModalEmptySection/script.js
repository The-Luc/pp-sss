import Modal from '@/components/Modal';
import PpButton from '@/components/Button';
import { mapMutations } from 'vuex';
import { MUTATES } from '@/store/modules/app/const';
import { setItem } from '@/common/storage';
import { BOOK_VIEW_TYPE, LOCAL_STORAGE } from '@/common/constants';

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
      setItem(LOCAL_STORAGE.CURRENT_SCREEN, BOOK_VIEW_TYPE.MANAGER);
      let currentUrl = this.$router.history.current.fullPath;
      if (currentUrl !== '/edit/manager') {
        this.$router.push('/edit/manager');
      }
      this.toggleModal({
        isOpenModal: false
      });
    }
  }
};
