import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';
import { EVENT_TYPE, OBJECT_TYPE } from '@/common/constants';
import { useModal } from '@/hooks';

const TITLE = {
  [OBJECT_TYPE.TEXT]: 'Add a name for this text style:',
  [OBJECT_TYPE.IMAGE]: 'Add a name for this image style:'
};

export default {
  setup() {
    const { modalData } = useModal();
    return { modalData };
  },
  components: {
    Modal,
    PpButton
  },
  data() {
    return {
      styleName: ''
    };
  },
  computed: {
    title() {
      const objectType = this.modalData?.props?.type;
      return TITLE[objectType] || '';
    }
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
