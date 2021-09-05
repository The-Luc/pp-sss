import PpInput from '@/components/InputProperty';

import GroupItem from '../GroupItem';

export default {
  components: {
    GroupItem,
    PpInput
  },
  props: {
    selectedDuration: {
      type: Number,
      default: 1
    }
  },
  methods: {
    /**
     * Emit change event to parent
     *
     * @param {Number}  duration  selected duration
     */
    onChangeDuration(duration) {
      this.$emit('durationChange', { duration });
    }
  }
};
