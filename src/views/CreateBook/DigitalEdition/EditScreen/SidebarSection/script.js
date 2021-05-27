import { mapGetters, mapMutations } from 'vuex';

import Thumbnail from '@/components/Thumbnail/ThumbnailDigital';
import HeaderContainer from '@/components/Thumbnail/HeaderContainer';
import { GETTERS, MUTATES } from '@/store/modules/book/const';

export default {
  components: {
    Thumbnail,
    HeaderContainer
  },
  computed: {
    ...mapGetters({
      pageSelected: GETTERS.GET_PAGE_SELECTED,
      book: GETTERS.BOOK_DETAIL
    }),
    orderScreen() {
      return (sectionId, sheet) => {
        const sectionIndex = this.book.sections.findIndex(
          item => item.id == sectionId
        );
        const indexSheet = this.book.sections[sectionIndex].sheets.findIndex(
          item => item.id == sheet.id
        );
        let indexInSections = 0;
        for (let i = 0; i < sectionIndex; i++) {
          indexInSections += this.book.sections[i].sheets.length;
        }
        indexInSections += indexSheet + 1;
        if (indexInSections < 10) {
          return '0' + indexInSections;
        } else {
          return '' + indexInSections;
        }
      };
    }
  },
  methods: {
    ...mapMutations({
      selectSheet: MUTATES.SELECT_SHEET
    }),
    /**
     * Check if that sheet is selected
     * @param  {String} sheetId Sheet's id selected
     */
    checkIsActive(sheetId) {
      return sheetId === this.pageSelected;
    },
    /**
     * Set selected sheet's id
     * @param  {String} sheetId Sheet's id selected
     */
    onSelectSheet(sheetId) {
      this.selectSheet({ sheetId });
    }
  }
};
