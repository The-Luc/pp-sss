import Modal from '@/containers/Modals/Modal';

export default {
  components: {
    Modal
  },
  props: {
    sheet: {
      type: Object,
      required: true
    }
  },
  computed: {
    numberPageLeft() {
      return this.sheet?.pageLeftName;
    },
    numberPageRight() {
      return this.sheet?.pageRightName;
    }
  },
  methods: {
    /**
     * Update layout to sheet, draw layout and then close modal
     * @param  {String} pagePosition Left or right layout
     */
    onUpdateLayoutSheet(pagePosition) {
      this.$emit('onApply', pagePosition);
    },
    /**
     * Draw left layout when user click button from modal
     */
    onLeftClick() {
      this.onUpdateLayoutSheet('left');
    },
    /**
     * Draw right layout when user click button from modal
     */
    onRightClick() {
      this.onUpdateLayoutSheet('right');
    }
  }
};
