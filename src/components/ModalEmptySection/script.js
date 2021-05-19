import { mapMutations, mapGetters } from 'vuex';
import Modal from '@/components/Modal';
import PpButton from '@/components/Button';
import { MUTATES } from '@/store/modules/app/const';
import { SCREEN } from '@/common/constants/book';
import { GETTERS } from '@/store/modules/book/const';
import { ROUTE_NAME } from '@/common/constants';

export default {
  components: {
    Modal,
    PpButton
  },
  computed: {
    ...mapGetters({
      bookId: GETTERS.BOOK_ID
    }),
    sections() {
      return this.$attrs.props.sections;
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    onChangeView() {
      let routeName = this.$router.history.current.name;
      if (routeName !== ROUTE_NAME.MANAGER) {
        this.$router.push(`/book/${this.bookId}${SCREEN.MANAGER}`);
      }
      this.toggleModal({
        isOpenModal: false
      });
    }
  }
};
