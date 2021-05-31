import { mapGetters, mapMutations } from 'vuex';

import Frames from '@/components/Thumbnail/Frames';
import Thumbnail from '@/components/Thumbnail/ThumbnailPrint';
import { GETTERS, MUTATES } from '@/store/modules/book/const';
import { useDrawLayout } from '@/hooks';

export default {
  setup() {
    const { drawLayout } = useDrawLayout();
    return { drawLayout };
  },
  components: {
    Frames,
    Thumbnail
  },
  computed: {
    ...mapGetters({
      bookId: GETTERS.BOOK_ID,
      book: GETTERS.BOOK_DETAIL,
      selectedLayout: GETTERS.SHEET_LAYOUT
    })
  },
  methods: {
    ...mapMutations({
      selectSheet: MUTATES.SELECT_SHEET,
      setSectionId: MUTATES.SET_SECTION_ID
    }),
    numberPage(sectionId, sheet) {
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
      let numberLeft = indexInSections * 2 - 4;
      let numberRight = indexInSections * 2 - 3;
      if (numberLeft < 10) {
        numberLeft = '0' + numberLeft;
      }
      if (numberLeft < 10) {
        numberRight = '0' + numberRight;
      }
      let numberPage;
      switch (sectionIndex) {
        case 0:
          numberPage = {
            numberLeft: 'Back Cover',
            numberRight: 'Front Cover'
          };
          break;
        case 1:
          if (indexSheet === 0) {
            numberPage = {
              numberLeft: 'Inside Front Cover',
              numberRight
            };
          } else {
            numberPage = {
              numberLeft,
              numberRight
            };
          }
          break;
        case this.book.sections.length - 1:
          if (
            indexSheet ===
            this.book.sections[sectionIndex].sheets.length - 1
          ) {
            numberPage = {
              numberLeft,
              numberRight: 'Inside Back Cover'
            };
          } else {
            numberPage = {
              numberLeft,
              numberRight
            };
          }
          break;
        default:
          numberPage = {
            numberLeft,
            numberRight
          };
          break;
      }
      return numberPage;
    },
    /**
     * Set selected sheet's id and section's id and then draw layout in print cavnas
     * @param  {String} sheetId Sheet's id selected
     * @param  {String} sectionId Section id contains sheet
     */
    onSelectSheet(sheetId, sectionId) {
      this.selectSheet({ sheetId });
      this.setSectionId({ sectionId });
      const layoutData = this.selectedLayout(sheetId);
      if (layoutData) {
        const { imageUrlLeft, imageUrlRight } = layoutData;
        // this.drawLayout(imageUrlLeft, imageUrlRight);
      }
    }
  }
};
