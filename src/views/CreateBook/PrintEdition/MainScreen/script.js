import { mapGetters, mapMutations, mapActions } from 'vuex';

import ListThumbContainer from '@/components/Thumbnail/ListThumbContainer';
import Thumbnail from '@/components/Thumbnail/ThumbnailPrint';
import {
  ACTIONS as PRINT_ACTIONS,
  MUTATES as PRINT_MUTATES,
  GETTERS as PRINT_GETTERS
} from '@/store/modules/print/const';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { useDrawLayout, useUser } from '@/hooks';

import printService from '@/api/print';
import { ROLE } from '@/common/constants';

export default {
  components: {
    ListThumbContainer,
    Thumbnail
  },
  setup() {
    const { drawLayout } = useDrawLayout();
    const { currentUser } = useUser();

    return { drawLayout, currentUser };
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
     * Set change link status for sheet
     *
     * @param  {Number} sheetId sheet's id selected
     * @param  {String} link link status of sheet
     */
    changeLinkStatus(sheetId, link) {
      this.updateSectionLinkStatus({ link, sheetId });
    },
    /**
     * Check sheet is enable for current user
     *
     * @param   {Number}  assigneeId  assignee id of current section
     * @returns {Boolean}             is enable or not
     */
    checkIsEnable({ assigneeId }) {
      return (
        this.currentUser.role === ROLE.ADMIN ||
        assigneeId === this.currentUser.id
      );
    }
  }
};
