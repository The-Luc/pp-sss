import MoveControl from './MoveControl';

import { autoScroll } from '@/common/utils';

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
  data() {
    return {
      disabled: false
    };
  },
  watch: {
    currentPageIndex(newValue, oldValue) {
      if (newValue === oldValue) return;

      autoScroll(this.$refs, 'pageSelected');

      this.disabled = true;

      setTimeout(() => (this.disabled = false), 560);
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
    },
    /**
     * Is this page active
     *
     * @param   {Number}  index index of selected page
     * @returns {Boolean}       is activated
     */
    isActivated(index) {
      return index === this.currentPageIndex;
    }
  }
};
