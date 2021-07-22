import { mapGetters, mapMutations } from 'vuex';

import Thumbnail from '@/components/Thumbnail/ThumbnailPrint';
import SidebarThumbContainer from '@/components/Thumbnail/SidebarThumbContainer';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';
import {
  useLayoutPrompt,
  useResetPrintConfig,
  usePopoverCreationTool,
  useObjectProperties
} from '@/hooks';
import { TOOL_NAME, EDITION } from '@/common/constants';
import { isEmpty, scrollToElement } from '@/common/utils';

export default {
  components: {
    Thumbnail,
    SidebarThumbContainer
  },
  setup() {
    const { resetPrintConfig } = useResetPrintConfig();
    const { setToolNameSelected } = usePopoverCreationTool();
    const { toggleMenuProperties } = useObjectProperties();
    const { updateVisited, setIsPrompt } = useLayoutPrompt(EDITION.PRINT);

    return {
      toggleMenuProperties,
      updateVisited,
      setToolNameSelected,
      resetPrintConfig,
      setIsPrompt
    };
  },
  computed: {
    ...mapGetters({
      pageSelected: PRINT_GETTERS.CURRENT_SHEET,
      sections: PRINT_GETTERS.SECTIONS_SHEETS,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES
    })
  },
  created() {
    this.handleWatchForAutoScroll();
  },
  methods: {
    ...mapMutations({
      selectSheet: PRINT_MUTATES.SET_CURRENT_SHEET_ID
    }),
    /**
     * Handle watch when pageSelected change to make autoscroll then destroy watch
     */
    handleWatchForAutoScroll() {
      const watchHandler = this.$watch(
        'pageSelected',
        value => {
          if (isEmpty(value)) return;

          setTimeout(() => {
            this.autoScrollToSpread(value.id);
          }, 20);

          watchHandler();
        },
        {
          deep: true
        }
      );
    },
    /**
     * Get spread refs by sheet's id and handle auto scroll
     *
     * @param  {Number} pageSelected Sheet's id selected
     */
    autoScrollToSpread(pageSelected) {
      const currentSpreadActive = this.$refs[`spread${pageSelected}`];

      if (isEmpty(currentSpreadActive)) return;

      scrollToElement(currentSpreadActive[0]?.$el);
    },
    numberPage(sheet) {
      return {
        numberLeft: sheet.pageLeftName,
        numberRight: sheet.pageRightName
      };
    },
    /**
     * Check if that sheet is selected
     * @param  {String} sheetId Sheet's id selected
     */
    checkIsActive(sheetId) {
      return sheetId === this.pageSelected?.id;
    },
    /**
     * Set selected sheet's id & show notice if not visited
     *
     * @param {String | Number} id  id of selected sheet
     */
    onSelectSheet({ id }) {
      if (this.pageSelected.id !== id) this.$router.push(`${id}`);

      if (this.isOpenMenuProperties) {
        this.toggleMenuProperties({ isOpenMenuProperties: false });
      }

      if (this.pageSelected.isVisited) return;

      this.setIsPrompt({ isPrompt: false });

      this.updateVisited({ sheetId: id });

      this.setToolNameSelected(TOOL_NAME.PRINT_LAYOUTS);
    }
  }
};
