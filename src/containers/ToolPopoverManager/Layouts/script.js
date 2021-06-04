import { mapGetters, mapMutations } from 'vuex';

import { GETTERS as THEME_GETTERS } from '@/store/modules/theme/const';
import {
  GETTERS as APP_GETTERS,
  MUTATES as APP_MUTATES
} from '@/store/modules/app/const';
import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';
import { THEMES_LIST } from '@/mock/themesList';
import PpToolPopover from '@/components/ToolPopover';
import PpSelect from '@/components/Select';
import SelectLayout from './SelectLayout';
import SelectTheme from './SelectTheme';
import GotIt from './GotIt';
import Item from './Item';
import { LAYOUT_TYPES_OPTIONs } from '@/mock/layoutTypes';
import {
  LAYOUT_TYPES,
  MODAL_TYPES,
  SHEET_TYPES,
  TOOL_NAME
} from '@/common/constants';
import {
  getThemeOptSelectedById,
  getLayoutOptSelectedById
} from '@/common/utils';
import {
  usePopoverCreationTool,
  useLayoutPrompt,
  useDrawLayout
} from '@/hooks';

export default {
  setup() {
    const { setToolNameSelected, selectedToolName } = usePopoverCreationTool();
    const { updateVisited, setIsPrompt } = useLayoutPrompt();
    const { drawLayout } = useDrawLayout();
    return {
      selectedToolName,
      setToolNameSelected,
      updateVisited,
      setIsPrompt,
      drawLayout
    };
  },
  components: {
    PpToolPopover,
    PpSelect,
    Item,
    SelectTheme,
    SelectLayout,
    GotIt
  },
  data() {
    return {
      themesOptions: THEMES_LIST,
      layoutsOpts: LAYOUT_TYPES_OPTIONs,
      disabled: false,
      layoutSelected: {},
      themeSelected: {},
      tempLayoutIdSelected: null,
      layoutEmptyLength: 4,
      layoutObjSelected: {}
    };
  },
  computed: {
    ...mapGetters({
      themes: THEME_GETTERS.GET_THEMES,
      listLayouts: THEME_GETTERS.GET_LAYOUTS,
      book: BOOK_GETTERS.BOOK_DETAIL,
      pageSelected: BOOK_GETTERS.GET_PAGE_SELECTED,
      sheetLayout: BOOK_GETTERS.SHEET_LAYOUT,
      sheetTheme: BOOK_GETTERS.SHEET_THEME,
      getLayoutByType: THEME_GETTERS.GET_LAYOUT_BY_TYPE,
      isPrompt: APP_GETTERS.IS_PROMPT,
      sectionId: BOOK_GETTERS.SECTION_ID
    }),
    isVisited() {
      return this.pageSelected.isVisited;
    },
    layouts() {
      if (this.themeSelected?.id && this.layoutSelected?.value) {
        return this.getLayoutByType(
          this.themeSelected?.id,
          this.layoutSelected?.value
        );
      }
      return [];
    }
  },
  watch: {
    selectedToolName(val) {
      if (val && val === TOOL_NAME.LAYOUTS) {
        this.initData();
      }
    },
    pageSelected: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.id !== oldVal.id) {
          this.initData();
        }
      }
    },
    layouts() {
      this.setLayoutActive();
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapMutations({
      updateSheetThemeLayout: BOOK_MUTATES.UPDATE_SHEET_THEME_LAYOUT,
      toggleModal: APP_MUTATES.TOGGLE_MODAL
    }),
    /**
     * Set up inital data to render in view
     */
    initData() {
      this.setLayoutSelected(this.pageSelected);
      this.setDisabledLayout(this.pageSelected);
      this.setThemeSelected(this.pageSelected);
      this.setLayoutActive();
    },
    /**
     * Set default selected for layout base on id of sheet: Cover, Single Page or Collage
     * @param  {Number} pageSelected Id of sheet selected
     */
    setLayoutSelected(pageSelected) {
      const sheetType = pageSelected.type;
      switch (sheetType) {
        case SHEET_TYPES.COVER:
          {
            const coverOption = this.layoutsOpts.find(
              l => l.value === LAYOUT_TYPES.COVER.value
            );
            this.layoutSelected = coverOption;
          }
          break;
        case SHEET_TYPES.FRONT_COVER:
        case SHEET_TYPES.BACK_COVER:
          {
            const singlePageOption = this.layoutsOpts.find(
              l => l.value === LAYOUT_TYPES.SINGLE_PAGE.value
            );
            this.layoutSelected = singlePageOption;
          }
          break;
        default:
          {
            // Use default layout if the sheet no have private layout
            const sheetLayout = this.pageSelected.printData.layout;
            if (sheetLayout?.id) {
              const layoutOpt = getLayoutOptSelectedById(
                this.listLayouts(),
                this.layoutsOpts,
                sheetLayout.id
              );
              this.layoutSelected = layoutOpt;
            } else {
              const collageOption = this.layoutsOpts.find(
                l => l.value === LAYOUT_TYPES.COLLAGE.value
              );
              this.layoutSelected = collageOption;
            }
          }
          break;
      }
    },
    /**
     * Set disabled select layout base on id of sheet are cover or half-sheet
     * @param  {Number} pageSelected Id of sheet selected
     */
    setDisabledLayout(pageSelected) {
      const isDisabled = [
        SHEET_TYPES.COVER,
        SHEET_TYPES.FRONT_COVER,
        SHEET_TYPES.BACK_COVER
      ].includes(pageSelected.type);
      this.disabled = isDisabled;
    },
    /**
     * Set default selected for theme base on id of sheet. Use default theme when the sheet not have private theme
     * @param  {Number} pageSelected Id of sheet selected
     */
    setThemeSelected(pageSelected) {
      const currentSheetThemeId = this.sheetTheme(pageSelected);
      const defaultThemeId = this.book.printData.themeId;
      if (currentSheetThemeId) {
        const themeOpt = getThemeOptSelectedById(
          this.themesOptions,
          currentSheetThemeId
        );
        this.themeSelected = themeOpt;
      } else {
        const themeSelected = this.themesOptions.find(
          t => t.id === defaultThemeId
        );
        this.themeSelected = themeSelected;
      }
    },
    /**
     * Set object theme selected from dropdown
     */
    onChangeTheme(theme) {
      this.themeSelected = theme;
    },
    /**
     * Set object layout selected from dropdown
     */
    onChangeLayout(layout) {
      this.layoutSelected = layout;
    },
    /**
     * When open layout from creation tool, check sheet has exist layout before or not
     * if not, first layout is selected, else is sheet's layout
     */
    setLayoutActive() {
      if (this.layouts.length > 0) {
        this.tempLayoutIdSelected = this.layouts[0].id;
        this.layoutObjSelected = this.layouts[0];
        const sheetLayout = this.pageSelected.printData.layout;
        if (sheetLayout?.id) {
          const sheetLayoutObj = this.layouts.find(
            layout => layout.id === sheetLayout.id
          );
          if (sheetLayoutObj?.id) {
            this.tempLayoutIdSelected = sheetLayoutObj.id;
          }
        }
      }
    },
    /**
     * Set current layout active when user click layout which they want change
     */
    onSelectLayout(layout) {
      this.layoutObjSelected = layout;
      this.tempLayoutIdSelected = layout.id;
    },
    /**
     * Trigger hooks to set tool name is empty and then close popover when click Cancel button
     */
    onCancel() {
      this.setToolNameSelected('');
    },
    /**
     * Base on section id and sheet id to get page number of sheet
     * @param {Number} sectionId - Current section id of sheet
     * @param {Number} sheetId - Current sheet id
     * @returns {Object} Page number left and right of sheet
     */
    numberPage(sectionId, sheetId) {
      const sectionIndex = this.book.sections.findIndex(
        item => item.id === sectionId
      );
      const indexSheet = this.book.sections[sectionIndex].sheets.findIndex(
        item => item.id === sheetId
      );
      let indexInSections = 0;
      for (let i = 0; i < sectionIndex; i++) {
        indexInSections += this.book.sections[i].sheets.length;
      }
      indexInSections += indexSheet + 1;
      let numberPageLeft = indexInSections * 2 - 4;
      let numberPageRight = indexInSections * 2 - 3;
      return {
        numberPageLeft,
        numberPageRight
      };
    },
    /**
     * Trigger mutation to set theme and layout for sheet after that close popover when click Select button
     */
    setThemeLayoutForSheet() {
      if (this.layouts.length > 0 && this.tempLayoutIdSelected) {
        let position = '';
        if (this.pageSelected.type === SHEET_TYPES.FRONT_COVER) {
          position = 'right';
        }

        if (this.pageSelected.type === SHEET_TYPES.BACK_COVER) {
          position = 'left';
        }

        if (
          this.layoutObjSelected.type === LAYOUT_TYPES.SINGLE_PAGE.value &&
          ![SHEET_TYPES.FRONT_COVER, SHEET_TYPES.BACK_COVER].includes(
            this.pageSelected.type
          )
        ) {
          // Show choose layout modal
          const { numberPageLeft, numberPageRight } = this.numberPage(
            this.sectionId,
            this.pageSelected
          );

          this.onCancel();
          this.toggleModal({
            isOpenModal: true,
            modalData: {
              type: MODAL_TYPES.SELECT_PAGE,
              props: {
                numberPageLeft,
                numberPageRight,
                sheetId: this.pageSelected.id,
                themeId: this.themeSelected.id,
                layout: this.layoutObjSelected
              }
            }
          });
          return;
        }
        this.drawLayout(this.layoutObjSelected, position);
        this.updateSheetThemeLayout({
          sheetId: this.pageSelected.id,
          themeId: this.themeSelected.id,
          layout: this.layoutObjSelected
        });
        this.onCancel();
      }
    },
    /**
     * Trigger mutation set prompt false and update isVisited true for current sheet
     */
    onClickGotIt() {
      this.setIsPrompt({
        isPrompt: false
      });
      this.updateVisited({
        sheetId: this.pageSelected?.id
      });
    }
  }
};
