import ThumbnailItem from '@/components/Thumbnail/ThumbnailItem';

import { mapGetters, mapActions } from 'vuex';

import { useUser } from '@/hooks';

import { getSectionsWithAccessible } from '@/common/utils';

import {
  ACTIONS as PRINT_ACTIONS,
  GETTERS as PRINT_GETTERS
} from '@/store/modules/print/const';

import { LINK_STATUS } from '@/common/constants';
import { useSaveData, useBookPrintInfo } from './composables';

export default {
  components: {
    ThumbnailItem
  },
  setup() {
    const { currentUser } = useUser();
    const { savePrintMainScreen, sheets } = useSaveData();
    const { getBookPrintInfo } = useBookPrintInfo();

    return { currentUser, savePrintMainScreen, sheets, getBookPrintInfo };
  },
  async created() {
    await this.getBookPrintInfo(this.$route.params.bookId);
  },
  async beforeDestroy() {
    await this.savePrintMainScreen(this.sheets);
  },
  computed: {
    ...mapGetters({
      sectionList: PRINT_GETTERS.SECTIONS_SHEETS
    }),
    bookId() {
      return this.$route.params.bookId;
    },
    sections() {
      return getSectionsWithAccessible(this.sectionList, this.currentUser);
    }
  },
  methods: {
    ...mapActions({
      updateSectionLinkStatus: PRINT_ACTIONS.UPDATE_SHEET_LINK_STATUS
    }),
    /**
     * Get names of page of selected sheet
     *
     * @param   {String}  pageLeftName  name of page left of selected sheet
     * @param   {String}  pageRightName name of page right of selected sheet
     * @returns {Object}                names of page
     */
    getPageNames({ pageLeftName, pageRightName }) {
      return {
        left: pageLeftName,
        right: pageRightName
      };
    },
    /**
     * Set change link status for sheet
     *
     * @param  {Number} sheetId sheet's id selected
     * @param  {String} link link status of sheet
     */
    changeLinkStatus(sheetId, link) {
      const statusLink =
        link === LINK_STATUS.LINK ? LINK_STATUS.UNLINK : LINK_STATUS.LINK;
      this.updateSectionLinkStatus({ link: statusLink, sheetId });
    }
  }
};
