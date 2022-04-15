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
  props: {
    layout: {
      type: Object,
      required: true
    }
  },
  methods: {
    /**
     * Trigger when use apply want to apply layout
     */
    onApplyLayout() {
      this.$emit('onApply');
    },
    /**
     * Trigger when use hit cancel button
     */
    onCancel() {
      this.$emit('onCancel');
    }
  }
};
