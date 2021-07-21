import { mapGetters, mapMutations } from 'vuex';

import Thumbnail from '@/components/Thumbnail/ThumbnailDigital';
import HeaderContainer from '@/components/Thumbnail/HeaderContainer';
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
  components: {
    Thumbnail,
    HeaderContainer
  },
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
  computed: {
    ...mapGetters({
      pageSelected: DIGITAL_GETTERS.CURRENT_SHEET,
      sections: DIGITAL_GETTERS.SECTIONS_SHEETS,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES
    }),
    orderScreen() {
      return (sectionIndex, sheetIndex) => {
        let indexInSections = 0;
        for (let i = 0; i < sectionIndex; i++) {
          indexInSections += this.sections[i].sheets.length;
        }
        indexInSections += sheetIndex + 1;
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
      return sheetId === this.pageSelected.id;
    },
    /**
     * Set selected sheet's id & show notice if not visited
     *
     * @param {String | Number} id  id of selected sheet
     */
    onSelectSheet({ id }) {
      this.selectSheet({ id });

      if (this.isOpenMenuProperites) {
        this.toggleMenuProperties({ isOpenMenuProperites: false });
      }

      this.$router.push(`${id}`);

      if (this.pageSelected.isVisited) return;

      this.setIsPrompt({ isPrompt: false });

      this.updateVisited({ sheetId: id });

      this.setToolNameSelected(TOOL_NAME.DIGITAL_LAYOUTS);
    }
  }
};
