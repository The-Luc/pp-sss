import { mapGetters, mapMutations } from 'vuex';

import {
  GETTERS as THEME_GETTERS,
  MUTATES as THEME_MUTATES
} from '@/store/modules/theme/const';

import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';

import {
  GETTERS as APP_GETTERS,
  MUTATES as APP_MUTATES
} from '@/store/modules/app/const';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
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
  resetObjects,
  activeCanvas,
  isEmpty
} from '@/common/utils';
import {
  usePopoverCreationTool,
  useLayoutPrompt,
  useDrawLayout,
  useGetLayouts,
  useFrame
} from '@/hooks';

import { loadLayouts, loadSupplementalLayouts } from '@/api/layouts';
import { loadDigitalLayouts } from '@/api/layouts';
import { cloneDeep } from 'lodash';

export default {
  setup({ edition }) {
    const { setToolNameSelected, selectedToolName } = usePopoverCreationTool();
    const { currentFrame } = useFrame();
    const {
      updateVisited,
      setIsPrompt,
      pageSelected,
      themeId
    } = useLayoutPrompt(edition);
    const { drawLayout } = useDrawLayout();
    const {
      sheetLayout,
      getLayoutsByType,
      listLayouts,
      updateSheetThemeLayout
    } = useGetLayouts(edition);
    return {
      selectedToolName,
      setToolNameSelected,
      updateVisited,
      setIsPrompt,
      drawLayout,
      pageSelected,
      sheetLayout,
      getLayoutsByType,
      listLayouts,
      themeId,
      updateSheetThemeLayout,
      currentFrame
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
    },
    initialData: {
      type: Object
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
      isPrompt: APP_GETTERS.IS_PROMPT,
      triggerAppyLayout: DIGITAL_GETTERS.TRIGGER_APPLY_LAYOUT,
      totalBackground: PRINT_GETTERS.TOTAL_BACKGROUND,
      printObject: PRINT_GETTERS.GET_OBJECTS
    }),
    isVisited() {
      return this.pageSelected?.isVisited;
    },
    layouts() {
      if (this.themeSelected?.id && this.layoutSelected?.value) {
        return this.getLayoutsByType(
          this.themeSelected?.id,
          this.layoutSelected?.value
        );
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
    },
    initialData: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal?.disabled !== oldVal?.disabled) {
          this.initData();
        }
      }
    },
    triggerAppyLayout() {
      this.applyLayout();
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapMutations({
      toggleModal: APP_MUTATES.TOGGLE_MODAL,
      setPrintLayouts: THEME_MUTATES.PRINT_LAYOUTS,
      setDigitalLayouts: THEME_MUTATES.DIGITAL_LAYOUTS
    }),
    /**
     * Set up inital data to render in view
     */
    initData() {
      this.setLayoutSelected(this.pageSelected);
      this.setDisabledLayout(this.pageSelected);
      this.setThemeSelected(this.themeId);
      this.setLayoutActive();
    },
    /**
     * Set default selected for layout base on id of sheet: Cover, Single Page or Collage
     * @param  {Number} pageSelected Id of sheet selected
     */
    setLayoutSelected(pageSelected) {
      if (this.initialData?.layoutSelected) {
        this.layoutSelected = this.initialData.layoutSelected;
        return;
      }
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
      this.disabled =
        this.initialData?.disabled ??
        this.initialData?.isSupplemental ??
        [
          SHEET_TYPE.COVER,
          SHEET_TYPE.FRONT_COVER,
          SHEET_TYPE.BACK_COVER
        ].includes(pageSelected.type);
    },
    /**
     * Set default selected for theme base on id of sheet. Use default theme when the sheet not have private theme
     * @param  {Number} pageSelected Id of sheet selected
     */
    setThemeSelected(currentSheetThemeId) {
      if (currentSheetThemeId) {
        const themeOpt = getThemeOptSelectedById(
          this.themesOptions,
          currentSheetThemeId
        );
        this.themeSelected = themeOpt;
      } else {
        const themeSelected = this.themesOptions.find(
          t => t.id === this.defaultThemeId
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

        const layoutId = this.initialData?.isSupplemental
          ? this.currentFrame?.supplementalLayoutId
          : this.pageSelected?.layoutId;

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
      console.log(layout.id);
      this.tempLayoutIdSelected = layout.id;
    },
    /**
     * Trigger hooks to set tool name is empty and then close popover when click Cancel button
     */
    onCancel() {
      this.setToolNameSelected('');
      this.$emit('close');
    },
    /**
     * Trigger mutation to set theme and layout for sheet after that close popover when click Select button
     */
    setThemeLayoutForSheet() {
      if (this.layouts.length > 0 && this.tempLayoutIdSelected) {
        if (
          !this.isDigital &&
          (this.totalBackground || !isEmpty(this.printObject))
        ) {
          this.onCancel();
          this.toggleModal({
            isOpenModal: true,
            modalData: {
              type: MODAL_TYPES.RESET_LAYOUT,
              props: {
                pageSelected: this.pageSelected,
                sheetId: this.pageSelected?.id,
                themeId: this.themeSelected?.id,
                layout: this.layoutObjSelected,
                layoutObjSelected: this.layoutObjSelected
              }
            }
          });
          return;
        }

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

        if (
          this.layoutObjSelected?.type ===
          LAYOUT_TYPES.SUPPLEMENTAL_LAYOUTS.value
        ) {
          this.$emit('addFrame', this.layoutObjSelected);
          return;
        }

        // Prompt a modal to comfirm overriding layout if layoutId existed and in DIGITAL mode
        if (this.isDigital && this.pageSelected?.layoutId) {
          this.toggleModal({
            isOpenModal: true,
            modalData: {
              type: MODAL_TYPES.OVERRIDE_LAYOUT
            }
          });
        } else {
          this.applyLayout();
        }

        this.onCancel();
      }
    },
    /**
     * Save objects to store and draw on canvas
     */
    applyLayout() {
      // save id and objects of the first frame to the store
      this.updateSheetThemeLayout({
        sheetId: this.pageSelected?.id,
        themeId: this.themeSelected?.id,
        layout: cloneDeep(this.layoutObjSelected)
      });

      resetObjects(activeCanvas);

      // draw layout on canvas
      this.drawLayout(this.sheetLayout, this.edition);
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
    },

    /**
     * to update the display text for print and digital mode
     */
    updateTextDisplay() {
      const printText = {
        promptMsg:
          'The best way to get started is by selecting a layout. As a shortcut, the layouts from your selecting theme will be presented first.',
        promptTitle: 'Select a Layout',
        title: 'Layouts',
        optionTitle: 'Layout Type:'
      };
      const digitalText = {
        promptMsg:
          'The best way to get started is by selecting a screen layout. As a shortcut, the screens from your selecting theme will be presented first.',
        promptTitle: 'Select a Screen Layout',
        title: 'Screen Layouts',
        optionTitle: 'Screen Type:'
      };

      return this.isDigital ? digitalText : printText;
    }
  },
  async created() {
    this.isDigital = this.edition === EDITION.DIGITAL;

    this.textDisplay = this.updateTextDisplay();

    let layouts = [];

    if (!this.isDigital) {
      layouts = await loadLayouts();
      this.setPrintLayouts({ layouts });
      return;
    }

    if (this.initialData?.isSupplemental) {
      layouts = await loadSupplementalLayouts();
    } else {
      layouts = await loadDigitalLayouts();
    }

    this.setDigitalLayouts({ layouts });
  }
};
