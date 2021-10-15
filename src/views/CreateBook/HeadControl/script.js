import BookInformation from './BookInformation';
import BookControl from './BookControl';
import BookNumber from './BookNumber';

import { useAppCommon } from '@/hooks';

import { ROUTE_NAME } from '@/common/constants';

export default {
  components: {
    BookInformation,
    BookControl,
    BookNumber
  },
  setup() {
    const { generalInfo } = useAppCommon();

    return { generalInfo };
  },
  data() {
    return {
      isHeaderDisplayed: true,
      isInfoBarDisplayed: true
    };
  },
  computed: {
    numberInfo() {
      const { totalSheet, totalPage, totalScreen } = this.generalInfo;

      return { totalSheet, totalPage, totalScreen };
    }
  },
  watch: {
    ['$route.name'](name) {
      this.checkShowHeader(name);
    }
  },
  methods: {
    /**
     * Check if should be show the header in selected route
     *
     * @param {String}  name  route name
     */
    checkShowHeader(name) {
      const isPrintEdition = name === ROUTE_NAME.PRINT_EDIT;
      const isDigitalEdition = name === ROUTE_NAME.DIGITAL_EDIT;
      const isPrintPage = name === ROUTE_NAME.PRINT_PAGE;

      this.isHeaderDisplayed =
        !isPrintEdition && !isDigitalEdition && !isPrintPage;

      this.isInfoBarDisplayed = !isPrintPage;
    }
  },
  created() {
    this.checkShowHeader(this.$route.name);
  }
};
