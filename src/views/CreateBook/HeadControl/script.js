import BookInformation from './BookInformation';
import BookControl from './BookControl';
import BookNumber from './BookNumber';
import { ROUTE_NAME } from '@/common/constants';

export default {
  components: {
    BookInformation,
    BookControl,
    BookNumber
  },
  data() {
    return {
      showHeader: true
    };
  },
  watch: {
    ['$route.name'](name) {
      this.checkShowHeader(name);
    }
  },
  methods: {
    checkShowHeader(name) {
      if (name === ROUTE_NAME.PRINT_EDIT || name === ROUTE_NAME.DIGITAL_EDIT) {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
    }
  },
  created() {
    this.checkShowHeader(this.$route.path);
  }
};
