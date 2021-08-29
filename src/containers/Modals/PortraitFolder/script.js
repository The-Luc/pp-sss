import CommonModal from '../CommonModal';

export default {
  components: { CommonModal },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Close modal portrait folder
     */
    onCancel() {
      this.$emit('cancel');
    },
    /**
     * Select portrait folders
     */
    onSelect() {
      this.$emit('onSelectPortrait', [1, 2]);
    }
  }
};
