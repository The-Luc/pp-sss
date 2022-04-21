import { mapMutations, mapGetters } from 'vuex';
import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';
import { MUTATES } from '@/store/modules/app/const';
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
        this.$router.push({
          name: ROUTE_NAME.MANAGER,
          params: { bookId: this.bookId }
        });
      }
      this.toggleModal({
        isOpenModal: false
      });
    }
  }
};
