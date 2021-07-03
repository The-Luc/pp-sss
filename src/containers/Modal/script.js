import { mapGetters, mapMutations } from 'vuex';

import { GETTERS, MUTATES } from '@/store/modules/app/const';
import Header from './Header';
import { KEY_CODE } from '@/common/constants';

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
    },
    themeModal: {
      type: Boolean,
      default: false
    },
    isShowHeader: {
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
    /**
     * Trigger mutation update state to close modal
     */
    onCloseModal() {
      if (this.isCloseOutSide) {
        this.toggleModal({
          isOpenModal: false
        });
      }
    },
    /**
     * Catch when user click Escape and then call onCloseModal function to update state
     */
    onKeyDown(event) {
      const key = event.keyCode || event.charCode;
      if (key === KEY_CODE.ESCAPE) {
        this.onCloseModal();
      }
    }
  }
};
