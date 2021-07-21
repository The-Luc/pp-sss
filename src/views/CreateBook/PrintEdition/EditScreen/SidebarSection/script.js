import { mapGetters, mapMutations } from 'vuex';

import Thumbnail from '@/containers/ThumbnailPrint';
import HeaderContainer from '@/components/Thumbnail/HeaderContainer';
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
import { scrollToElement } from '@/common/utils';

export default {
  components: {
    Thumbnail,
    HeaderContainer
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
  mounted() {
    setTimeout(() => {
      this.autoScrollToSpread(this.pageSelected.id);
    }, 500);
  },
  methods: {
    ...mapMutations({
      selectSheet: PRINT_MUTATES.SET_CURRENT_SHEET_ID
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
     * Set selected sheet's id & show notice if not visited
     *
     * @param {String | Number} id  id of selected sheet
     */
    onSelectSheet({ id }) {
      this.selectSheet({ id });

      if (this.isOpenMenuProperties) {
        this.toggleMenuProperties({ isOpenMenuProperties: false });
      }

      this.$router.push(`${id}`);

      if (this.pageSelected.isVisited) return;

      this.setIsPrompt({ isPrompt: false });

      this.updateVisited({ sheetId: id });

      this.setToolNameSelected(TOOL_NAME.PRINT_LAYOUTS);
    }
  }
};
