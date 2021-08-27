import Modal from '@/containers/Modals/Modal';

import { mapMutations } from 'vuex';

import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

export default {
  components: {
    Modal
  },
  computed: {
    numberPageLeft() {
      return this.$attrs.props.numberPageLeft;
    },
    numberPageRight() {
      return this.$attrs.props.numberPageRight;
    },
    background() {
      return this.$attrs.props.background;
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: APP_MUTATES.TOGGLE_MODAL
    }),
    /**
     * Trigger mutation to close modal
     */
    closeModal() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    /**
     * Trigger mutation to update single page background
     *
     * @param {Boolean} isLeft  left or right background
     */
    updateBackground(isLeft) {
      this.$root.$emit('printAddBackground', {
        background: this.background,
        isLeft
      });

      this.closeModal();
    },
    /**
     * Draw left background when user click button from modal
     */
    onLeftClick() {
      this.updateBackground(true);
    },
    /**
     * Draw right background when user click button from modal
     */
    onRightClick() {
      this.updateBackground(false);
    }
  }
};
