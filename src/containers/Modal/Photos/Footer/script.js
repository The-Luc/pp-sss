import PpButton from '@/components/Buttons/Button';

export default {
  components: {
    PpButton
  },
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Select photo by emit to parent
     */
    onSelect() {
      this.$emit('select');
    },
    /**
     * Emit cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
    }
  }
};
