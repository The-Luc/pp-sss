import { mapGetters, mapMutations, mapActions } from 'vuex';

import Frames from '@/components/Thumbnail/Frames';
import Thumbnail from '@/containers/ThumbnailPrint';
import { MUTATES } from '@/store/modules/book/const';
import {
  ACTIONS as PRINT_ACTIONS,
  MUTATES as PRINT_MUTATES,
  GETTERS as PRINT_GETTERS
} from '@/store/modules/print/const';
import { useDrawLayout } from '@/hooks';
import { EDITION } from '@/common/constants';

export default {
  components: {
    Frames,
    Thumbnail
  },
  setup() {
    const { drawLayout } = useDrawLayout();
    return { drawLayout };
  },
  created() {
    this.setBookId({ bookId: this.$route.params.bookId });

    this.getDataPageEdit();
  },
  computed: {
    ...mapGetters({
      sheetLayout: PRINT_GETTERS.SHEET_LAYOUT,
      sections: PRINT_GETTERS.SECTIONS_SHEETS
    }),
    bookId() {
      return this.$route.params.bookId;
    }
  },
  methods: {
    ...mapActions({
      getDataPageEdit: PRINT_ACTIONS.GET_DATA_MAIN,
      updateSectionLinkStatus: PRINT_ACTIONS.UPDATE_SHEET_LINK_STATUS
    }),
    ...mapMutations({
      setBookId: PRINT_MUTATES.SET_BOOK_ID,
      selectSheet: PRINT_MUTATES.SET_CURRENT_SHEET_ID,
      setSectionId: MUTATES.SET_SECTION_ID
    }),
    numberPage(sheet) {
      return {
        numberLeft: sheet.pageLeftName,
        numberRight: sheet.pageRightName
      };
    },
    /**
     * Set selected sheet's id and section's id and then draw layout in print cavnas
     * @param  {String} sheet Sheet selected
     * @param  {String} sectionId Section id contains sheet
     */
    onSelectSheet(sheet, sectionId) {
      this.selectSheet({ id: sheet.id });
      this.setSectionId({ sectionId });
      setTimeout(() => {
        this.drawLayout(this.sheetLayout, EDITION.PRINT);
      }, 50);
    },
    /**
     * Set change link status for sheet
     * @param  {Number} sheetId sheet's id selected
     * @param  {String} link link status of sheet
     */
    changeLinkStatus(sheetId, link) {
      this.updateSectionLinkStatus({ link, sheetId });
    }
  }
};
