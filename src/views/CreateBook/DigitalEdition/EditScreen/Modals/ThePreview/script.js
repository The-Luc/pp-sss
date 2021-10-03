import CommonModal from '@/components/Modals/CommonModal';

export default {
  components: {
    CommonModal
  },
  props: {
    width: {
      type: String,
      default: '800px'
    },
    height: {
      type: String,
      default: '450px'
    },
    canCloseOutside: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Emit close event to parent
     */
    onClose() {
      this.$emit('close');
    }
  }
};
