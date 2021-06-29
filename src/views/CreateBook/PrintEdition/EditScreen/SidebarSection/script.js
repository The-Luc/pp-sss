import { mapGetters, mapMutations } from 'vuex';

import Thumbnail from '@/containers/ThumbnailPrint';
import HeaderContainer from '@/components/Thumbnail/HeaderContainer';
import { MUTATES } from '@/store/modules/book/const';
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
import { TOOL_NAME } from '@/common/constants';
import { scrollToElement } from '@/common/utils';

export default {
  setup() {
    const { resetPrintConfig } = useResetPrintConfig();
    const { setToolNameSelected } = usePopoverCreationTool();
    const { toggleMenuProperties } = useObjectProperties();
    const { updateVisited, setIsPrompt } = useLayoutPrompt();
    return {
      toggleMenuProperties,
      updateVisited,
      setToolNameSelected,
      resetPrintConfig,
      setIsPrompt
    };
  },
  components: {
    Thumbnail,
    HeaderContainer
  },
  computed: {
    ...mapGetters({
      pageSelected: PRINT_GETTERS.CURRENT_SHEET,
      sections: PRINT_GETTERS.SECTIONS_SHEETS,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES
    })
  },
  mounted() {
    setTimeout(() => {
      this.autoScrollToSpread(this.pageSelected.id);
    }, 500);
  },
  methods: {
    ...mapMutations({
      selectSheet: PRINT_MUTATES.SET_CURRENT_SHEET_ID,
      setSectionId: MUTATES.SET_SECTION_ID
    }),
    /**
     * Get spread refs by sheet's id and handle auto scroll
     * @param  {Number} pageSelected Sheet's id selected
     */
    autoScrollToSpread(pageSelected) {
      const currentSpreadActive = this.$refs[`spread${pageSelected}`];
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
     * Set selected sheet's id and section'sid and then show prompt when sheet the first time access
     * @param  {String} sheet Sheet selected
     * @param  {String} sectionId Section id contains sheet
     */
    onSelectSheet(sheet, sectionId) {
      const sheetId = sheet?.id;
      this.selectSheet({ id: sheet.id });
      this.setSectionId({ sectionId });
      if (this.isOpenMenuProperties) {
        this.toggleMenuProperties({
          isOpenMenuProperties: false
        });
      }

      if (!this.pageSelected.isVisited) {
        this.setIsPrompt({
          isPrompt: false
        });
        this.updateVisited({
          sheetId
        });
        this.setToolNameSelected(TOOL_NAME.LAYOUTS);
      }
    }
  }
};
