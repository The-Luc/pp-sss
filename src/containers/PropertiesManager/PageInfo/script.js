import { mapGetters } from 'vuex';
import { GETTERS } from '@/store/modules/print/const';
import { useBook } from '@/hooks';

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
      return this.currentSheet.type === 0;
    },
    isSiglePage() {
      return this.currentSheet.type === 1;
    },
    isSpread() {
      return this.currentSheet.type === 3;
    },
    isLink() {
      return this.currentSheet.link === 'link';
    },
    titleNameLeft() {
      return this.isLink
        ? 'Left hand page:'
        : this.isSiglePage
        ? 'Page title:'
        : 'Spread title:';
    }
  }
};
