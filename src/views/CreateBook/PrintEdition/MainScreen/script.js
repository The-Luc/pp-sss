import ThumbnailItem from '@/components/Thumbnail/ThumbnailItem';

import { mapGetters, mapMutations, mapActions } from 'vuex';

import { useUser } from '@/hooks';

import { getSectionsWithAccessible } from '@/common/utils';

import {
  ACTIONS as PRINT_ACTIONS,
  MUTATES as PRINT_MUTATES,
  GETTERS as PRINT_GETTERS
} from '@/store/modules/print/const';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';

import printService from '@/api/print';
import { useSaveData } from './composables';

export default {
  components: {
    ThumbnailItem
  },
  setup() {
    const { currentUser } = useUser();
    const { savePrintMainScreen, sheets } = useSaveData();

    return { currentUser, savePrintMainScreen, sheets };
  },
  async created() {
    this.setBookId({ bookId: this.$route.params.bookId });

    // temporary code, will remove soon
    const info = await printService.getGeneralInfo();

    this.setInfo({ ...info, bookId: this.$route.params.bookId });

    this.getDataPageEdit();
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
      getDataPageEdit: PRINT_ACTIONS.GET_DATA_MAIN,
      updateSectionLinkStatus: PRINT_ACTIONS.UPDATE_SHEET_LINK_STATUS
    }),
    ...mapMutations({
      setBookId: PRINT_MUTATES.SET_BOOK_ID,
      setInfo: APP_MUTATES.SET_GENERAL_INFO
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
      this.updateSectionLinkStatus({ link, sheetId });
    }
  }
};
