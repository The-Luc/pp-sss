import { mapGetters } from 'vuex';

import Frames from '@/components/Thumbnail/Frames';
import Thumbnail from '@/components/Thumbnail/ThumbnailDigital';
import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
    Frames,
    Thumbnail
  },
  computed: {
    ...mapGetters({
      bookId: GETTERS.BOOK_ID,
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
  }
};
