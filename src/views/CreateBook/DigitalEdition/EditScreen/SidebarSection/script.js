import { mapGetters, mapMutations } from 'vuex';

import Thumbnail from '@/components/Thumbnail/ThumbnailDigital';
import HeaderContainer from '@/components/Thumbnail/HeaderContainer';
import { GETTERS } from '@/store/modules/book/const';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import { scrollToElement } from '@/common/utils';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import {
  useLayoutPrompt,
  usePopoverCreationTool,
  useObjectProperties
} from '@/hooks';
import { TOOL_NAME, EDITION } from '@/common/constants';

export default {
  setup() {
    const { setToolNameSelected } = usePopoverCreationTool();
    const { toggleMenuProperties } = useObjectProperties();
    const { updateVisited, setIsPrompt } = useLayoutPrompt(EDITION.DIGITAL);
    return {
      toggleMenuProperties,
      updateVisited,
      setToolNameSelected,
      setIsPrompt
    };
  },
  components: {
    Thumbnail,
    HeaderContainer
  },
  computed: {
    ...mapGetters({
      pageSelected: DIGITAL_GETTERS.CURRENT_SHEET,
      book: GETTERS.BOOK_DETAIL,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES
    }),
    orderScreen() {
      return (sectionId, sheet) => {
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
        if (indexInSections < 10) {
          return '0' + indexInSections;
        } else {
          return '' + indexInSections;
        }
      };
    }
  },
  mounted() {
    setTimeout(() => {
      this.autoScrollToScreen(this.pageSelected.id);
    }, 500);
  },
  methods: {
    ...mapMutations({
      selectSheet: DIGITAL_MUTATES.SET_CURRENT_SHEET_ID
    }),
    /**
     * Get screen refs by sheet's id and handle auto scroll
     * @param  {Number} pageSelected Sheet's id selected
     */
    autoScrollToScreen(pageSelected) {
      const currentScreendActive = this.$refs[`screen${pageSelected}`];
      scrollToElement(currentScreendActive[0].$el);
    },
    /**
     * Check if that sheet is selected
     * @param  {String} sheetId Sheet's id selected
     */
    checkIsActive(sheetId) {
      // return sheetId === this.pageSelected?.id;
      return sheetId === this.pageSelected.id;
    },
    /**
     * Set selected sheet's id
     * @param  {String} sheetId Sheet's id selected
     */
    onSelectSheet(sheet) {
      const sheetId = sheet?.id;
      this.selectSheet({ id: sheetId });

      if (this.isOpenMenuProperites) {
        this.toggleMenuProperties({
          isOpenMenuProperites: false
        });
      }

      if (!this.pageSelected.isVisited) {
        this.setIsPrompt({
          isPrompt: false
        });
        this.updateVisited({
          sheetId
        });
        this.setToolNameSelected(TOOL_NAME.DIGITAL_LAYOUTS);
      }
    }
  }
};
