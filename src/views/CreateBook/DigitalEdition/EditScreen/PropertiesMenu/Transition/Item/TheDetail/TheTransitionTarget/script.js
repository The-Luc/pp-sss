import PpSelect from '@/components/Selectors/Select';

import GroupItem from '../GroupItem';

import { TRANS_TARGET_DEFAULT, TRANS_TARGET_OPTIONS } from '@/common/constants';

export default {
  components: {
    GroupItem,
    PpSelect
  },
  data() {
    return {
      targets: TRANS_TARGET_OPTIONS,
      defaultValue: TRANS_TARGET_DEFAULT
    };
  },
  methods: {
    /**
     * Emit change event to parent
     *
     * @param {Object}  target  selected target
     */
    onTargetChange(target) {
      this.$emit('targetChange', { target: target.value });
    }
  }
};
