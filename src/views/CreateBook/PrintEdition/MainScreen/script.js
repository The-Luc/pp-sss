import { mapGetters, mapMutations, mapActions } from 'vuex';

import Frames from '@/components/Thumbnail/Frames';
import Thumbnail from '@/containers/ThumbnailPrint';
import {
  ACTIONS as PRINT_ACTIONS,
  MUTATES as PRINT_MUTATES,
  GETTERS as PRINT_GETTERS
} from '@/store/modules/print/const';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { useDrawLayout } from '@/hooks';
import printService from '@/api/print';

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

    // temporary code, will remove soon
    const info = printService.getGeneralInfo();

    this.setInfo({ ...info, bookId: this.$route.params.bookId });

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
      setInfo: APP_MUTATES.SET_GENERAL_INFO
    }),
    numberPage(sheet) {
      return {
        numberLeft: sheet.pageLeftName,
        numberRight: sheet.pageRightName
      };
    },
    /**
     * Set selected sheet's id
     *
     * @param {String | Number} id  id of selected sheet
     */
    onSelectSheet({ id }) {
      this.selectSheet({ id });
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
