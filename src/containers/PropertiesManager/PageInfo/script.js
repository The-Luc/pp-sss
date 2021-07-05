import { mapGetters } from 'vuex';
import { GETTERS } from '@/store/modules/print/const';
import { useBook } from '@/hooks';
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
      currentSheet: GETTERS.CURRENT_SHEET
    }),
    isCover() {
      return this.currentSheet.type === SHEET_TYPE.COVER;
    },
    isSiglePage() {
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
    titleNameLeft() {
      return this.isLink
        ? 'Left hand page:'
        : this.isSiglePage
        ? 'Page title:'
        : 'Spread title:';
    },
    titleNameNumber() {
      return this.isSiglePage
        ? '(for this page only)'
        : this.isSpread
        ? '(for this spread only)'
        : '';
    }
  }
};
