import { mapGetters, mapMutations, mapActions } from 'vuex';

import {
  GETTERS as THEME_GETTERS,
  MUTATES as THEME_MUTATES
} from '@/store/modules/theme/const';
import {
  GETTERS as APP_GETTERS,
  MUTATES as APP_MUTATES
} from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import {
  GETTERS as PRINT_GETTERS,
  ACTIONS as PRINT_ACTIONS
} from '@/store/modules/print/const';

import {
  GETTERS as DIGITAL_GETTERS,
  ACTIONS as DIGITAL_ACTIONS
} from '@/store/modules/digital/const';

import { themeOptions } from '@/mock/themes';
import PpToolPopover from '@/components/ToolPopover';
import PpSelect from '@/components/Selectors/Select';
import SelectLayout from './SelectLayout';
import SelectTheme from './SelectTheme';
import GotIt from './GotIt';
import Item from './Item';
import { LAYOUT_TYPES_OPTIONs } from '@/mock/layoutTypes';
import {
  EDITION,
  LAYOUT_TYPES,
  MODAL_TYPES,
  SHEET_TYPE,
  TOOL_NAME
} from '@/common/constants';
import {
  getThemeOptSelectedById,
  getLayoutOptSelectedById,
  resetObjects
} from '@/common/utils';
import {
  usePopoverCreationTool,
  useLayoutPrompt,
  useDrawLayout
} from '@/hooks';

import { loadLayouts } from '@/api/layouts';
// import { loadDigitalLayouts as loadLayouts } from '@/api/layouts';

// =========================
const EDITION_GETTERS = window.printCanvas ? PRINT_GETTERS : DIGITAL_GETTERS;
// =========================

export default {
  setup({ edition }) {
    const { setToolNameSelected, selectedToolName } = usePopoverCreationTool();
    const { updateVisited, setIsPrompt } = useLayoutPrompt(edition);
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
  props: {
    edition: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      themesOptions: themeOptions,
      layoutsOpts: LAYOUT_TYPES_OPTIONs,
      disabled: false,
      layoutSelected: {},
      themeSelected: {},
      tempLayoutIdSelected: null,
      layoutEmptyLength: 4,
      layoutObjSelected: {},
      textDisplay: null,
      isDigital: false
    };
  },
  computed: {
    ...mapGetters({
      themes: THEME_GETTERS.GET_THEMES,
      listLayouts: THEME_GETTERS.GET_PRINT_LAYOUTS_BY_THEME_ID,
      book: BOOK_GETTERS.BOOK_DETAIL,
      printPageSelected: PRINT_GETTERS.CURRENT_SHEET,
      digitalPageSelected: DIGITAL_GETTERS.CURRENT_SHEET,
      printSheetLayout: PRINT_GETTERS.SHEET_LAYOUT,
      digitalSheetLayout: DIGITAL_GETTERS.SHEET_LAYOUT,
      sheetTheme: BOOK_GETTERS.SHEET_THEME,
      getLayoutByType: THEME_GETTERS.GET_PRINT_LAYOUT_BY_TYPE,
      getDigitalLayoutById: THEME_GETTERS.GET_DIGITAL_LAYOUTS_BY_THEME_ID,
      isPrompt: APP_GETTERS.IS_PROMPT,
      sectionId: BOOK_GETTERS.SECTION_ID
    }),
    pageSelected() {
      return this.isDigital ? this.digitalPageSelected : this.printPageSelected;
    },
    sheetLayout() {
      return this.isDigital ? this.digitalSheetLayout : this.printSheetLayout;
    },
    isVisited() {
      return this.pageSelected?.isVisited;
    },
    layouts() {
      if (this.themeSelected?.id && this.layoutSelected?.value) {
        if (this.isDigital) {
          return this.getLayoutByType(
            this.themeSelected?.id,
            this.layoutSelected?.value
          );
        }
        return this.getDigitalLayoutById(this.themeSelected?.id);
      }
      return [];
    }
  },
  watch: {
    selectedToolName(val) {
      if (
        val &&
        (val === TOOL_NAME.PRINT_LAYOUTS || val === TOOL_NAME.DIGITAL_LAYOUTS)
      ) {
        this.initData();
      }
    },
    pageSelected: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal?.id !== oldVal?.id) {
          this.initData();
        }
      }
    },
    layouts() {
      this.setLayoutActive();
    }
  },
  mounted() {
    this.isDigital = this.edition === EDITION.DIGITAL;
    this.initData();
  },
  methods: {
    ...mapMutations({
      toggleModal: APP_MUTATES.TOGGLE_MODAL,
      setPrintLayouts: THEME_MUTATES.PRINT_LAYOUTS,
      setDigitalLayouts: THEME_MUTATES.DIGITAL_LAYOUTS
    }),
    ...mapActions({
      updateSheetThemeLayout: PRINT_ACTIONS.UPDATE_SHEET_THEME_LAYOUT
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
        case SHEET_TYPE.COVER:
          {
            const coverOption = this.layoutsOpts.find(
              l => l.value === LAYOUT_TYPES.COVER.value
            );
            this.layoutSelected = coverOption;
          }
          break;
        case SHEET_TYPE.FRONT_COVER:
        case SHEET_TYPE.BACK_COVER:
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
            const layoutId = this.pageSelected?.layoutId;
            if (layoutId) {
              const layoutOpt = getLayoutOptSelectedById(
                this.listLayouts(),
                this.layoutsOpts,
                layoutId
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
        SHEET_TYPE.COVER,
        SHEET_TYPE.FRONT_COVER,
        SHEET_TYPE.BACK_COVER
      ].includes(pageSelected.type);
      this.disabled = isDisabled;
    },
    /**
     * Set default selected for theme base on id of sheet. Use default theme when the sheet not have private theme
     * @param  {Number} pageSelected Id of sheet selected
     */
    setThemeSelected(pageSelected) {
      const currentSheetThemeId = pageSelected.themeId;
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
        const layoutId = this.pageSelected?.layoutId;
        if (layoutId) {
          const sheetLayoutObj = this.layouts.find(
            layout => layout.id === layoutId
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
     * Trigger mutation to set theme and layout for sheet after that close popover when click Select button
     */
    setThemeLayoutForSheet() {
      if (this.layouts.length > 0 && this.tempLayoutIdSelected) {
        if (
          this.layoutObjSelected.type === LAYOUT_TYPES.SINGLE_PAGE.value &&
          ![SHEET_TYPE.FRONT_COVER, SHEET_TYPE.BACK_COVER].includes(
            this.pageSelected?.type
          )
        ) {
          this.onCancel();
          this.toggleModal({
            isOpenModal: true,
            modalData: {
              type: MODAL_TYPES.SELECT_PAGE,
              props: {
                numberPageLeft: this.pageSelected?.pageLeftName,
                numberPageRight: this.pageSelected?.pageRightName,
                sheetId: this.pageSelected?.id,
                themeId: this.themeSelected?.id,
                layout: this.layoutObjSelected
              }
            }
          });
          return;
        }
        this.updateSheetThemeLayout({
          sheetId: this.pageSelected?.id,
          themeId: this.themeSelected?.id,
          layout: this.layoutObjSelected
        });
        resetObjects(window.printCanvas);
        this.drawLayout(this.sheetLayout);
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
      console.log(this.pageSelected);
      this.updateVisited({
        sheetId: this.pageSelected?.id
      });
    },

    /**
     * to update the display text for print and digital mode
     */
    updateTextDisplay() {
      const printText = {
        promptMsg:
          'The best way to get started is by selecting a layout. As a shortcut, the layouts from your selecting theme will be presented first.',
        promptHeader: 'Select a Layout',
        title: 'Layouts',
        optionTitle: 'Layout Type:'
      };
      const digitalText = {
        promptMsg:
          'The best way to get started is by selecting a screen layout. As a shortcut, the screens from your selecting theme will be presented first.',
        promptHeader: 'Select a Screen Layout',
        title: 'Screen Layouts',
        optionTitle: 'Screen Type:'
      };

      return window.printCanvas ? printText : digitalText;
    }
  },
  async created() {
    this.textDisplay = this.updateTextDisplay();

    if (this.listLayouts().length !== 0) {
      const layouts = await loadLayouts();
      // TODO:
      if (window.printCanvas) {
        this.setPrintLayouts({
          layouts
        });
      } else {
        this.setDigitalLayouts({
          layouts
        });
      }
    }
  }
};
