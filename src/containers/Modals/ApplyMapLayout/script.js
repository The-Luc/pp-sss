import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';

export default {
  components: {
    Modal,
    PpButton
  },
  props: {
    header: {
      type: String,
      default: 'Digital Edition'
    },
    isDigital: {
      type: Boolean,
      default: false
    },
    imgUrls: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currEditor: this.isDigital ? 'digital' : 'print',
      otherEditor: this.isDigital ? 'print' : 'digital'
    };
  },
  computed: {
    firstActionButton() {
      return 'Apply layout to print AND digital editions';
    },
    secondActionButton() {
      return this.isDigital
        ? 'Apply layout to digital edition only'
        : 'Apply layout to print edition only';
    },
    isSingleImg() {
      return this.imgUrls.length === 1 || !this.isDigital;
    }
  },
  methods: {
    /**
     * Fire when user click cancel
     */
    onCancel() {
      this.$emit('onCancel');
    },
    /**
     * Fire when user click on first action
     */
    onFirstAction() {
      this.$emit('onApplyBoth');
    },
    /**
     * Fire when user click on second action
     */
    onSecondAction() {
      this.$emit('onApplyPrimary');
    }
  }
};
