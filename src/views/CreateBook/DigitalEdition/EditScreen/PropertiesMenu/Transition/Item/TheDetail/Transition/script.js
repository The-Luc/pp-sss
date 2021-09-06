import PpSelect from '@/components/Selectors/Select';

import GroupItem from '../GroupItem';

export default {
  components: {
    GroupItem,
    PpSelect
  },
  props: {
    transitions: {
      type: Array,
      default: () => []
    },
    selectedTransition: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    /**
     * Emit change event to parent
     *
     * @param {Object}  transition  selected transition
     */
    onChangeTransition(transition) {
      this.$emit('transitionChange', { transition });
    }
  }
};
