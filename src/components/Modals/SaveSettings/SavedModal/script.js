import CommonModal from '@/containers/Modals/CommonModal';

export default {
  components: {
    CommonModal
  },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    }
  }
};
