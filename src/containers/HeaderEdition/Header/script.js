import { SAVE_STATUS, SAVING_DURATION } from '@/common/constants';
import PpButton from '@/components/Buttons/Button';
import { useSavingStatus } from '@/views/CreateBook/composables';
import SavingIndicator from './SavingIndicator';

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
      if (val && this.savingStatus === SAVE_STATUS.END)
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
