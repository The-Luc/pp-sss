import MoveControl from './MoveControl';

export default {
  components: {
    MoveControl
  },
  props: {
    pages: {
      type: Array,
      default: () => []
    },
    currentPageIndex: {
      type: Number,
      default: 0
    },
    isPosibleToBack: {
      type: Boolean,
      default: false
    },
    isPosibleToNext: {
      type: Boolean,
      default: false
    },
    isDigital: {
      type: Boolean
    }
  },
  methods: {
    /**
     * Emit move next to parent
     */
    onNext() {
      this.$emit('move-next');
    },
    /**
     * Emit move back to parent
     */
    onBack() {
      this.$emit('move-back');
    },
    /**
     * Emit selected page index to parent
     *
     * @param {Number}  index index of selected page
     */
    onSelected(index) {
      this.$emit('page-selected', { index });
    }
  }
};
