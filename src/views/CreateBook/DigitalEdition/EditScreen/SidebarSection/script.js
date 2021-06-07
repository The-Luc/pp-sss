import { mapGetters, mapMutations } from 'vuex';

import Thumbnail from '@/components/Thumbnail/ThumbnailDigital';
import HeaderContainer from '@/components/Thumbnail/HeaderContainer';
import { GETTERS, MUTATES } from '@/store/modules/book/const';
import { scrollToElement } from '@/common/utils';

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
  mounted() {
    setTimeout(() => {
      this.autoScrollToScreen(this.pageSelected.id);
    }, 500);
  },
  methods: {
    ...mapMutations({
      selectSheet: MUTATES.SELECT_SHEET
    }),
    /**
     * Get screen refs by sheet's id and handle auto scroll
     * @param  {Number} pageSelected Sheet's id selected
     */
    autoScrollToScreen(pageSelected) {
      const currentScreendActive = this.$refs[`screen${pageSelected}`];
      scrollToElement(currentScreendActive[0].$el);
    },
    /**
     * Check if that sheet is selected
     * @param  {String} sheetId Sheet's id selected
     */
    checkIsActive(sheetId) {
      return sheetId === this.pageSelected.id;
    },
    /**
     * Set selected sheet's id
     * @param  {String} sheetId Sheet's id selected
     */
    onSelectSheet(sheet) {
      this.selectSheet({ sheet });
    }
  }
};
