import PpButton from '@/components/Button';
export default {
  components: {
    PpButton
  },
  props: {
    nameEditor: {
      type: String,
      required: true
    }
  },
  methods: {
    /**
     * Click save and emit save button
     */
    onClickSave() {
      this.$emit('onClickSave');
    }
  }
};
