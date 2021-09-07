import GroupItem from '../GroupItem';

export default {
  components: {
    GroupItem
  },
  methods: {
    /**
     * Emit click event to parent
     */
    onTransitionApply() {
      this.$emit('transitionApply');
    }
  }
};
