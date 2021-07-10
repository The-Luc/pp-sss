import { mapGetters, mapMutations } from 'vuex';
import { useBook } from '@/hooks';
import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';

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
      pageInfo: PRINT_GETTERS.GET_PAGE_INFO
    }),
    isCover() {
      return this.currentSheet.type === SHEET_TYPE.COVER;
    },
    isFrontCover() {
      return this.currentSheet.type === SHEET_TYPE.FRONT_COVER;
    },
    isBackCover() {
      return this.currentSheet.type === SHEET_TYPE.BACK_COVER;
    },
    isSpread() {
      return this.currentSheet.type === SHEET_TYPE.NORMAL;
    },
    isLink() {
      return this.currentSheet.link === LINK_STATUS.LINK;
    },
    spreadInfo() {
      return this.currentSheet?.spreadInfo;
    },
    disabled() {
      return !this.pageInfo.isNumberingOn;
    }
  },
  methods: {
    ...mapMutations({
      setStatusPageNumber: PRINT_MUTATES.SET_STATUS_PAGE_NUMBER,
      setPageInfo: PRINT_MUTATES.SET_PAGE_INFO
    }),
    /**
     * Receive status page number from children
     * @param   {Object}  val Value user selected
     */
    onChangePageNumber(val) {
      const key = Object.keys(val)[0];

      switch (key) {
        case 'isNumberOn':
          this.setStatusPageNumber(val.isNumberOn);
          break;
        case 'isLeftNumberOn':
          console.log(val);
          break;
        case 'isRightNumberOn':
          console.log(val);
          break;
        case 'position':
          this.setChangePageInfo(val);
          break;
        default:
          return;
      }
    },
    /**
     * Receive value page info from children
     * @param   {Object}  val Value user selected
     */
    onChangePageInfo(val) {
      this.setChangePageInfo(val);
    },
    /**
     * set value page info change
     * @param   {Object}  val Value user selected
     */
    setChangePageInfo(val) {
      const changePageInfo = {
        ...this.pageInfo,
        ...val
      };
      this.setPageInfo({ pageInfo: changePageInfo });
    }
  }
};
