import { isEmpty } from '@/common/utils';

export default {
  props: {
    item: {
      type: Object,
      default: () => ({ id: '' })
    },
    selectedVal: {
      type: Array,
      default: () => []
    },
    isEmpty: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isSelected() {
      if (isEmpty(this.selectedVal)) return false;

      const selected = this.selectedVal.find(s => s.id === this.item.id);

      return !isEmpty(selected);
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
