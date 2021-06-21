import PpButton from '@/components/Buttons/Button';
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
