import ThumbnailItem from '@/components/Thumbnail/ThumbnailItem';

import { mapGetters, mapActions } from 'vuex';

import { useUser } from '@/hooks';

import { getSectionsWithAccessible } from '@/common/utils';

import {
  ACTIONS as PRINT_ACTIONS,
  GETTERS as PRINT_GETTERS
} from '@/store/modules/print/const';

import { LINK_STATUS, ROLE } from '@/common/constants';
import { useSaveData, useBookPrintInfo } from './composables';
import { useSectionItems } from '@/views/CreateBook/Manager/composables';

export default {
  components: {
    ThumbnailItem
  },
  setup() {
    const { currentUser } = useUser();
    const { savePrintMainScreen, sheets } = useSaveData();
    const { getBookPrintInfo } = useBookPrintInfo();
    const { sections: bookSections } = useSectionItems();

    return {
      currentUser,
      savePrintMainScreen,
      sheets,
      getBookPrintInfo,
      bookSections
    };
  },
  async created() {
    await this.getBookPrintInfo(this.$route.params.bookId);
  },
  async beforeDestroy() {
    await this.savePrintMainScreen(this.sheets);
  },
  data() {
    return {
      selectedSheet: null
    };
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
    },
    isAdmin() {
      return this.currentUser.role === ROLE.ADMIN;
    }
  },
  watch: {
    bookSections: {
      deep: true,
      async handler(val, oldVal) {
        if (val !== oldVal)
          await this.getBookPrintInfo(this.$route.params.bookId);
      }
    }
  },
  watch: {
    bookSections: {
      deep: true,
      async handler(val, oldVal) {
        if (val !== oldVal)
          await this.getBookPrintInfo(this.$route.params.bookId);
      }
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
    },
    /**
     * Toggle menu by set sheet selected id
     */
    toggleMenu(sheetId) {
      if (!this.selectedSheet || this.selectedSheet !== sheetId) {
        this.selectedSheet = sheetId;
        return;
      }

      if (this.selectedSheet && this.selectedSheet === sheetId) {
        this.onCloseMenu();
      }
    },
    /**
     * Preview print edition
     */
    onPreview(sheetId) {
      console.log(sheetId);
    },
    /**
     * Export pdf
     */
    onExportPDF() {
      console.log('PDF');
    },
    /**
     * set sheet selected is null and close menu
     */
    onCloseMenu() {
      this.selectedSheet = null;
    }
  }
};
