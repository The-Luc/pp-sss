import { isFullBackground } from '@/common/utils';

export default {
  props: {
    item: {
      type: Object,
      default: () => ({ id: '' })
    },
    selectedVal: {
      type: Object,
      default: () => ({ id: '' })
    },
    isEmpty: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isSinglePage() {
      return !isFullBackground(this.item.pageType);
    }
  },
  methods: {
    /**
     * Emit layout selected to parent
     */
    onClick() {
      this.$emit('click', this.item);
    }
  }
};
