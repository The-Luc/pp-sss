import PpInput from '@/components/InputProperty';

import GroupItem from '../GroupItem';

import { isInRange } from '@/common/utils';

import {
  TRANS_DURATION_DEFAULT,
  TRANS_DURATION_RANGE
} from '@/common/constants';

export default {
  components: {
    GroupItem,
    PpInput
  },
  props: {
    selectedDuration: {
      type: Number,
      default: TRANS_DURATION_DEFAULT
    },
    disabled: {
      type: Boolean
    }
  },
  data() {
    return {
      componentKey: true
    };
  },
  methods: {
    /**
     * Emit change event to parent
     *
     * @param {Number}  value  selected duration
     */
    onDurationChange(value) {
      const duration = Number(value);

      if (
        isInRange(duration, TRANS_DURATION_RANGE.MIN, TRANS_DURATION_RANGE.MAX)
      )
        this.$emit('durationChange', { duration });
      else this.componentKey = !this.componentKey;
    }
  }
};
