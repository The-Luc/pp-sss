import PpSelect from '@/components/Selectors/Select';
import {
  PAGE_NUMBER_POSITION_OPTIONS,
  STATUS_PAGE_NUMBER_OPTIONS
} from '@/common/constants';

export default {
  components: {
    PpSelect
  },
  props: {
    titleName: {
      type: String,
      default: ''
    },
    isCover: {
      type: Boolean,
      default: true
    },
    isFrontCover: {
      type: Boolean,
      required: false
    },
    isBackCover: {
      type: Boolean,
      default: true
    },
    isLeftNumberOn: {
      type: Boolean,
      required: true
    },
    isRightNumberOn: {
      type: Boolean,
      required: false
    },
    position: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      statusPageNumber: STATUS_PAGE_NUMBER_OPTIONS,
      positionPageNumber: PAGE_NUMBER_POSITION_OPTIONS
    };
  },
  computed: {
    selectedPosition() {
      return this.positionPageNumber.find(
        ({ value }) => value === this.position
      );
    },
    selectedLeftNumber() {
      return this.statusPageNumber.find(
        ({ value }) => value === this.isLeftNumberOn
      );
    },
    selectedRightNumber() {
      return this.statusPageNumber.find(
        ({ value }) => value === this.isRightNumberOn
      );
    },
    isSinglePage() {
      return this.isFrontCover || this.isBackCover;
    },
    isNumberingOff() {
      return this.disabled ? !this.isCover : false;
    }
  },
  methods: {
    /**
     * Emit Status left page number change to parent
     * @param {Boolean} status - value status left page number selected
     */
    onChangeStatusLeft(status) {
      const frontCoverValue = this.isFrontCover
        ? { isRightNumberOn: status.value }
        : { isLeftNumberOn: status.value };

      const coverValue = { isNumberOn: status.value };

      this.$emit('change', this.isCover ? coverValue : frontCoverValue);
    },
    /**
     * Emit Status right page number change to parent
     * @param {Boolean} val - value status right page number selected
     */
    onChangeStatusRight(status) {
      this.$emit('change', { isRightNumberOn: status.value });
    },
    /**
     * Emit position change to parent
     * @param {String} position - value position selected
     */
    onChangePosition(position) {
      this.$emit('change', { position: position.value });
    }
  }
};
