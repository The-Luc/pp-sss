import PpSelect from '@/components/Selectors/Select';

import GroupItem from '../GroupItem';

export default {
  components: {
    GroupItem,
    PpSelect
  },
  props: {
    directions: {
      type: Array,
      default: () => []
    },
    selectedDirection: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    /**
     * Emit change event to parent
     *
     * @param {Object}  direction  selected direction
     */
    onChangeDirection(direction) {
      this.$emit('directionChange', { direction });
    }
  }
};
