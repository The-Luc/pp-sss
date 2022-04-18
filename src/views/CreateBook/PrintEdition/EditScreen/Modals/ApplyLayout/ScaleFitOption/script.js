import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';

import { useSheet } from '@/hooks';

export default {
  components: {
    Modal,
    PpButton
  },
  setup() {
    const { currentSheet } = useSheet();
    return {
      currentSheet
    };
  },
  methods: {
    onScale() {
      this.$emit('onScale');
    },
    onFit() {
      this.$emit('onFit');
    },
    onCancel() {
      this.$emit('onCancel');
    }
  }
};
