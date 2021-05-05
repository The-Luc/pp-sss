import ICON_LOCAL from '@/common/constants/icon';
import Modal from '@/components/Modal';

export default {
  components: {
    Modal
  },
  data() {
    return {
      isOpen: false
    };
  },
  created() {
    this.ICON_LOCAL = ICON_LOCAL;
  },
  methods: {
    openModal() {
      this.isOpen = true;
    }
  }
};
