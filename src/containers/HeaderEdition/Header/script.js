import { SAVING_DURATION } from '@/common/constants';
import PpButton from '@/components/Buttons/Button';
import SavingIndicator from './SavingIndicator';
import { useSavingStatus } from '@/hooks/common';

export default {
  setup() {
    const { savingStatus } = useSavingStatus();

    return { savingStatus };
  },
  components: {
    PpButton,
    SavingIndicator
  },
  props: {
    nameEditor: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      message: 'Autosaving...',
      overlay: false
    };
  },
  watch: {
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
      this.overlay = true;
      this.$emit('onClickSave');
    }
  }
};
