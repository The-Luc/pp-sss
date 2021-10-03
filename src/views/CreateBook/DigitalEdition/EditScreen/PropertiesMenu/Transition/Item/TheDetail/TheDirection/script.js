import PpSelect from '@/components/Selectors/Select';

import GroupItem from '../GroupItem';

import { isEmpty } from '@/common/utils';

import {
  TRANS_DIRECTION_DEFAULT,
  TRANS_DIRECTION_OPTIONS
} from '@/common/constants';

export default {
  components: {
    GroupItem,
    PpSelect
  },
  props: {
    selectedDirection: {
      type: [Number, String]
    },
    disabled: {
      type: Boolean
    }
  },
  data() {
    return {
      directions: TRANS_DIRECTION_OPTIONS
    };
  },
  computed: {
    direction() {
      if (this.disabled) return {};

      if (isEmpty(this.selectedDirection)) return TRANS_DIRECTION_DEFAULT;

      const direction = TRANS_DIRECTION_OPTIONS.find(
        ({ value }) => value === this.selectedDirection
      );

      return isEmpty(direction) ? TRANS_DIRECTION_DEFAULT : direction;
    }
  },
  methods: {
    /**
     * Emit change event to parent
     *
     * @param {Object}  direction  selected direction
     */
    onDirectionChange(direction) {
      this.$emit('directionChange', { direction: direction.value });
    }
  }
};
