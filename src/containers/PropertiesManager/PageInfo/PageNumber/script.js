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
    isSinglePage: {
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
    }
  },
  methods: {
    /**
     * Emit Status left page number change to parent
     * @param {Boolean} val - value status left page number selected
     */
    onChangeStatusLeft(val) {
      this.isCover
        ? this.$emit('change', { isNumberOn: val })
        : this.$emit('change', { isLeftNumberOn: val });
    },
    /**
     * Emit Status right page number change to parent
     * @param {Boolean} val - value status right page number selected
     */
    onChangeStatusRight(val) {
      this.$emit('change', { isRightNumberOn: val });
    },
    /**
     * Emit position change to parent
     * @param {String} val - value position selected
     */
    onChangePosition(val) {
      this.$emit('change', { position: val });
    }
  }
};
