import { SAVING_DURATION } from '@/common/constants';
import PpButton from '@/components/Buttons/Button';
import { useGetTriggerAutoSave } from '@/hooks/common';

export default {
  setup() {
    const { triggerAutosave } = useGetTriggerAutoSave();

    return { triggerAutosave };
  },
  components: {
    PpButton
  },
  props: {
    nameEditor: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      message: '',
      componentKey: false,
      overlay: false
    };
  },
  watch: {
    triggerAutosave() {
      this.message = 'Autosaving...';
      this.forceRenderComponent();
    },
    overlay(val) {
      val &&
        setTimeout(() => {
          this.overlay = false;
        }, SAVING_DURATION);
    }
  },
  methods: {
    /**
     * Click save and emit save button
     */
    onClickSave() {
      this.message = 'Saving....';
      this.forceRenderComponent();
      this.overlay = true;
      this.$emit('onClickSave');
    },

    /**
     * Trigger to re-render the component
     */
    forceRenderComponent() {
      this.componentKey = !this.componentKey;
    }
  }
};
