import { EVENT_TYPE, OBJECT_TYPE } from '@/common/constants';
import Modal from '@/containers/Modal';
import { useModal } from '@/hooks';

export default {
  setup() {
    const { modalData } = useModal();
    return { modalData };
  },
  components: {
    Modal
  },
  mounted() {
    if (this.modalData?.props?.objectType === OBJECT_TYPE.TEXT) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        styleId: this.modalData?.props?.styleId
      });
    }

    if (this.modalData?.props?.objectType === OBJECT_TYPE.IMAGE) {
      this.$root.$emit(EVENT_TYPE.CHANGE_IMAGE_PROPERTIES, {
        styleId: this.modalData?.props?.styleId
      });
    }

    setTimeout(() => {
      this.$root.$emit(EVENT_TYPE.SAVE_STYLE);
    }, 2000);
  }
};
