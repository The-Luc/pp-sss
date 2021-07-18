import Section from '../SummarySection';
import Detail from '../SummaryDetail';

import { useSummaryInfo } from '@/hooks';

import { getDisplayInfo } from '@/common/utils';

export default {
  components: {
    Section,
    Detail
  },
  setup() {
    const { specificationInfo } = useSummaryInfo();

    return { specificationInfo };
  },
  computed: {
    details() {
      return [
        this.getCoverOption(),
        this.getMaxPage(),
        this.getEstimatedQuantity(),
        this.getDeliveryOption()
      ];
    }
  },
  methods: {
    /**
     * Get display cover option
     *
     * @returns {Object}  display cover option of book
     */
    getCoverOption() {
      return getDisplayInfo(
        'Cover Option',
        this.specificationInfo?.coverOption
      );
    },
    /**
     * Get display max page
     *
     * @returns {Object}  display max page of book
     */
    getMaxPage() {
      return getDisplayInfo(
        'Number of Pages (maximum)',
        this.specificationInfo?.numberMaxPages
      );
    },
    /**
     * Get display estimate quantity
     *
     * @returns {Object}  display estimate quantity of book
     */
    getEstimatedQuantity() {
      const minQuantity = this.specificationInfo?.minQuantity;
      const maxQuantity = this.specificationInfo?.maxQuantity;

      return getDisplayInfo(
        'Estimated Quantity',
        `${minQuantity} - ${maxQuantity}`
      );
    },
    /**
     * Get display delivery option
     *
     * @returns {Object}  display delivery option of book
     */
    getDeliveryOption() {
      return getDisplayInfo(
        'Delivery Option',
        this.specificationInfo?.deliveryOption
      );
    }
  }
};
