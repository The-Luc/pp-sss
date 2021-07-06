import { mapGetters } from 'vuex';
import { useBook } from '@/hooks';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';

import { SHEET_TYPE, LINK_STATUS } from '@/common/constants';
import Properties from '@/components/Properties/BoxProperties';
import PageTitle from './PageTitle';
import PageNumber from './PageNumber';
import PpProperties from './Properties';

export default {
  setup() {
    const { book } = useBook();
    return {
      book
    };
  },
  components: {
    Properties,
    PageTitle,
    PageNumber,
    PpProperties
  },
  computed: {
    ...mapGetters({
      currentSheet: PRINT_GETTERS.CURRENT_SHEET,
      pageInfo: BOOK_GETTERS.GET_PAGE_INFO
    }),
    isCover() {
      return this.currentSheet.type === SHEET_TYPE.COVER;
    },
    isSinglePage() {
      return (
        this.currentSheet.type === SHEET_TYPE.FRONT_COVER ||
        this.currentSheet.type === SHEET_TYPE.BACK_COVER
      );
    },
    isSpread() {
      return this.currentSheet.type === SHEET_TYPE.NORMAL;
    },
    isLink() {
      return this.currentSheet.link === LINK_STATUS.LINK;
    },
    spreadInfo() {
      return this.currentSheet?.spreadInfo;
    }
  },
  methods: {
    onChangePageNumber(val) {
      console.log(val);
    },
    onChangepageInfo(val) {
      console.log(val);
    }
  }
};
