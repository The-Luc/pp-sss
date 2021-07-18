import { mapGetters, mapMutations, mapActions } from 'vuex';

import Frames from '@/components/Thumbnail/Frames';
import Thumbnail from '@/components/Thumbnail/ThumbnailDigital';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES,
  ACTIONS as DIGITAL_ACTIONS
} from '@/store/modules/digital/const';

export default {
  components: {
    Frames,
    Thumbnail
  },
  computed: {
    ...mapGetters({
      sections: DIGITAL_GETTERS.SECTIONS_SHEETS
    }),
    bookId() {
      return this.$route.params.bookId;
    },
    orderScreen() {
      return (sectionIndex, sheetIndex) => {
        let indexInSections = 0;
        for (let i = 0; i < sectionIndex; i++) {
          indexInSections += this.sections[i].sheets.length;
        }
        indexInSections += sheetIndex + 1;
        if (indexInSections < 10) {
          return '0' + indexInSections;
        } else {
          return '' + indexInSections;
        }
      };
    }
  },
  methods: {
    ...mapActions({
      getDataPageEdit: DIGITAL_ACTIONS.GET_DATA_MAIN
    }),
    ...mapMutations({
      setBookId: DIGITAL_MUTATES.SET_BOOK_ID,
      selectSheet: DIGITAL_MUTATES.SET_CURRENT_SHEET_ID,
      setSectionId: DIGITAL_MUTATES.SET_SECTION_ID
    }),

    /**
     * Set selected sheet's id
     * @param  {String} sheet Sheet selected
     */
    onSelectScreen(sheet) {
      this.selectSheet({ id: sheet.id });
    }
  },
  created() {
    this.setBookId({ bookId: this.$route.params.bookId });

    this.getDataPageEdit();
  }
};
