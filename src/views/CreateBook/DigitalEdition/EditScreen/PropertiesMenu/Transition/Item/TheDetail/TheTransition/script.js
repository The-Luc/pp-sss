import PpSelect from '@/components/Selectors/Select';

import GroupItem from '../GroupItem';

import { isEmpty } from '@/common/utils';

import { TRANSITION_DEFAULT, TRANSITION_OPTIONS } from '@/common/constants';

export default {
  components: {
    GroupItem,
    PpSelect
  },
  props: {
    selectedTransition: {
      type: Number
    }
  },
  data() {
    return {
      transitions: TRANSITION_OPTIONS
    };
  },
  computed: {
    transition() {
      if (isEmpty(this.selectedTransition)) return TRANSITION_DEFAULT;

      const transition = TRANSITION_OPTIONS.find(
        ({ value }) => value === this.selectedTransition
      );

      return isEmpty(transition) ? TRANSITION_DEFAULT : transition;
    }
  },
  methods: {
    /**
     * Emit change event to parent
     *
     * @param {Object}  transition  selected transition
     */
    onTransitionChange(transition) {
      this.$emit('transitionChange', { transition: transition.value });
    }
  }
};
