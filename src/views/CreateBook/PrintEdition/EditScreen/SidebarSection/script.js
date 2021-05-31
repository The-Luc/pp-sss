import { mapGetters, mapMutations } from 'vuex';

import Thumbnail from '@/components/Thumbnail/ThumbnailPrint';
import HeaderContainer from '@/components/Thumbnail/HeaderContainer';
import { GETTERS, MUTATES } from '@/store/modules/book/const';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import {
  useLayoutPrompt,
  useResetPrintConfig,
  usePopoverCreationTool,
  useObjectProperties
} from '@/hooks';
import { TOOL_NAME } from '@/common/constants';

export default {
  setup() {
    const { resetPrintConfig } = useResetPrintConfig();
    const { setToolNameSelected } = usePopoverCreationTool();
    const { toggleMenuProperties } = useObjectProperties();
    const {
      checkSheetIsVisited,
      updateVisited,
      setIsPrompt
    } = useLayoutPrompt();
    return {
      toggleMenuProperties,
      checkSheetIsVisited,
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
      pageSelected: GETTERS.GET_PAGE_SELECTED,
      book: GETTERS.BOOK_DETAIL,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES
    })
  },
  methods: {
    ...mapMutations({
      selectSheet: MUTATES.SELECT_SHEET,
      setSectionId: MUTATES.SET_SECTION_ID
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
     * Set selected sheet's id and section'sid and then show prompt when sheet the first time access
     * @param  {String} sheetId Sheet's id selected
     * @param  {String} sectionId Section id contains sheet
     */
    onSelectSheet(sheetId, sectionId) {
      this.selectSheet({ sheetId });
      this.setSectionId({ sectionId });
      const isVisited = this.checkSheetIsVisited(sheetId);
      if (this.isOpenMenuProperties) {
        this.toggleMenuProperties({
          isOpenMenuProperties: false
        });
      }

      if (!isVisited) {
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
