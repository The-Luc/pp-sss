import { mapGetters, mapMutations, mapActions } from 'vuex';

import Frames from '@/components/Thumbnail/Frames';
import Thumbnail from '@/components/Thumbnail/ThumbnailDigital';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES,
  ACTIONS as DIGITAL_ACTIONS
} from '@/store/modules/digital/const';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

import digitalService from '@/api/digital';

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
      setSectionId: DIGITAL_MUTATES.SET_SECTION_ID,
      setInfo: APP_MUTATES.SET_GENERAL_INFO
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

    // temporary code, will remove soon
    const info = digitalService.getGeneralInfo();

    this.setInfo({ ...info, bookId: this.$route.params.bookId });

    this.getDataPageEdit();
  }
};
