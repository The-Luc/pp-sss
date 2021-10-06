import ThumbnailItem from '@/components/Thumbnail/ThumbnailItem';
import Action from '@/containers/Menu/Action';
import PrintPreview from '@/containers/Modals/PrintPreview';

import { mapGetters, mapActions } from 'vuex';

import { useUser } from '@/hooks';

import { getSectionsWithAccessible } from '@/common/utils';

import {
  ACTIONS as PRINT_ACTIONS,
  GETTERS as PRINT_GETTERS
} from '@/store/modules/print/const';

import { LINK_STATUS } from '@/common/constants';
import { useSaveData, useBookPrintInfo } from './composables';
import { useSectionItems } from '@/views/CreateBook/Manager/composables';

export default {
  components: {
    ThumbnailItem,
    PrintPreview,
    Action
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
      selectedSheet: null,
      currentMenuHeight: 0,
      menuX: 0,
      menuY: 0,
      menuClass: 'pp-menu section-menu',
      previewedSheetId: null,
      isOpenPreviewModal: false
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
     * Close print preview modal
     */
    onCloseModalPreview() {
      this.isOpenPreviewModal = false;
    },
    /**
     * Toggle menu by set sheet selected id
     * @param  {Object} event fired event
     * @param  {String} sheetId  sheet's id selected
     */
    toggleMenu(event, sheetId) {
      this.setPositionMenu(event);

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
      this.previewedSheetId = sheetId;
      this.isOpenPreviewModal = true;
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
    },
    /**
     * Set current menu height
     * @param  {Object} event fired event
     */
    onMenuLoaded(event) {
      setTimeout(() => {
        this.currentMenuHeight = event.$el.clientHeight;
      }, 10);
    },
    /**
     * Set position for menu
     * @param  {Object} event fired event
     */
    setPositionMenu(event) {
      const element = event.target;
      const windowHeight = window.innerHeight;
      const elementY = event.y;

      const { x, y } = element.getBoundingClientRect();
      this.menuX = x - 82;
      this.menuY = y;
      this.menuClass = 'pp-menu section-menu';

      setTimeout(() => {
        if (windowHeight - elementY < this.currentMenuHeight) {
          this.menuY = y - this.currentMenuHeight - 45;
          this.menuClass = `${this.menuClass} section-menu-top`;
        } else {
          this.menuClass = `${this.menuClass} section-menu-bottom`;
          this.menuY = y;
        }
      }, 100);
    }
  }
};
