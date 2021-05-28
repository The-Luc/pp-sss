import { mapGetters, mapMutations } from 'vuex';

import Thumbnail from '@/components/Thumbnail/ThumbnailPrint';
import HeaderContainer from '@/components/Thumbnail/HeaderContainer';
import { GETTERS, MUTATES } from '@/store/modules/book/const';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import {
  useLayoutPrompt,
  useResetPrintConfig,
  usePopoverCreationTool
} from '@/hooks';
import { TOOL_NAME } from '@/common/constants';

export default {
  setup() {
    const { resetPrintConfig } = useResetPrintConfig();
    const { setToolNameSelected } = usePopoverCreationTool();
    const {
      checkSheetIsVisited,
      updateVisited,
      setIsPrompt
    } = useLayoutPrompt();
    return {
      checkSheetIsVisited,
      updateVisited,
      setIsPrompt,
      setToolNameSelected,
      resetPrintConfig
    };
  },
  components: {
    Thumbnail,
    HeaderContainer
  },
  computed: {
    ...mapGetters({
      pageSelected: GETTERS.GET_PAGE_SELECTED,
      book: GETTERS.BOOK_DETAIL,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: APP_GETTERS.SELECTED_TOOL_NAME
    })
  },
  methods: {
    ...mapMutations({
      selectSheet: MUTATES.SELECT_SHEET
    }),
    numberPage(sectionId, sheet) {
      const sectionIndex = this.book.sections.findIndex(
        item => item.id == sectionId
      );
      const indexSheet = this.book.sections[sectionIndex].sheets.findIndex(
        item => item.id == sheet.id
      );
      let indexInSections = 0;
      for (let i = 0; i < sectionIndex; i++) {
        indexInSections += this.book.sections[i].sheets.length;
      }
      indexInSections += indexSheet + 1;
      let numberLeft = indexInSections * 2 - 4;
      let numberRight = indexInSections * 2 - 3;
      if (numberLeft < 10) {
        numberLeft = '0' + numberLeft;
      }
      if (numberLeft < 10) {
        numberRight = '0' + numberRight;
      }
      let numberPage;
      switch (sectionIndex) {
        case 0:
          numberPage = {
            numberLeft: 'Back Cover',
            numberRight: 'Front Cover'
          };
          break;
        case 1:
          if (indexSheet === 0) {
            numberPage = {
              numberLeft: 'Inside Front Cover',
              numberRight
            };
          } else {
            numberPage = {
              numberLeft,
              numberRight
            };
          }
          break;
        case this.book.sections.length - 1:
          if (
            indexSheet ===
            this.book.sections[sectionIndex].sheets.length - 1
          ) {
            numberPage = {
              numberLeft,
              numberRight: 'Inside Back Cover'
            };
          } else {
            numberPage = {
              numberLeft,
              numberRight
            };
          }
          break;
        default:
          numberPage = {
            numberLeft,
            numberRight
          };
          break;
      }
      return numberPage;
    },
    /**
     * Check if that sheet is selected
     * @param  {String} sheetId Sheet's id selected
     */
    checkIsActive(sheetId) {
      return sheetId === this.pageSelected;
    },
    /**
     * Set selected sheet's id
     * @param  {String} sheetId Sheet's id selected
     */
    onSelectSheet(sheetId) {
      this.selectSheet({ sheetId });
      const isVisited = this.checkSheetIsVisited(sheetId);
      if (this.isOpenMenuProperties || this.selectedToolName) {
        this.resetPrintConfig();
      }
      if (!isVisited) {
        this.setToolNameSelected(TOOL_NAME.LAYOUTS);
        this.setIsPrompt({
          isPrompt: true
        });
        this.updateVisited({
          sheetId
        });
      }
    }
  }
};
