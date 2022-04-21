import PpInput from '@/components/Input/InputProperty';

import GroupItem from '../GroupItem';

import { isEmpty, isInRange } from '@/common/utils';

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
      type: [Number, String],
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
  computed: {
    duration() {
      return isEmpty(this.selectedDuration) ? 0 : this.selectedDuration;
    }
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
