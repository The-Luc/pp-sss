import Modal from '@/containers/Modal';
import PpButton from '@/components/Buttons/Button';
import { EVENT_TYPE } from '@/common/constants';

export default {
  components: {
    Modal,
    PpButton
  },
  data() {
    return {
      styleName: ''
    };
  },
  methods: {
    /**
     * trigger when save text or image style
     */
    onSaveStyle() {
      this.$root.$emit(EVENT_TYPE.SAVE_STYLE, { styleName: this.styleName });
    },

    /**
     * trigger when cancel save text or image style
     */
    onCancel() {
      this.$root.$emit(EVENT_TYPE.SAVE_STYLE);
    }
  }
};
