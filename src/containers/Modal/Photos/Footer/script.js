import PpButton from '@/components/Buttons/Button';

export default {
  components: {
    PpButton
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
