import { BACKGROUND_PAGE_TYPE } from '@/common/constants';

export default {
  props: {
    item: {
      type: Object,
      default: () => ({ id: '', property: {} })
    },
    selectedVal: {
      type: Object,
      default: () => ({ id: '', property: {} })
    },
    isEmpty: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isSinglePage() {
      return (
        this.item.property.pageType === BACKGROUND_PAGE_TYPE.SINGLE_PAGE.id
      );
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
