import { mapGetters, mapMutations } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';
import Header from './Header';

export default {
  components: {
    Header
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    showIconClose: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '500'
    },
    isCloseOutSide: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      isOpenModal: GETTERS.IS_OPEN_MODAL
    })
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    onCloseModal() {
      if (this.isCloseOutSide) {
        this.toggleModal({
          isOpenModal: false
        });
      }
    }
  }
};
