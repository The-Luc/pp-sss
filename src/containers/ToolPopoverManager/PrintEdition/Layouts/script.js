import { mapGetters, mapMutations } from 'vuex';

import { MUTATES as THEME_MUTATES } from '@/store/modules/theme/const';

import {
  GETTERS as APP_GETTERS,
  MUTATES as APP_MUTATES
} from '@/store/modules/app/const';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import PpToolPopover from '@/components/ToolPopover';
import PpSelect from '@/components/Selectors/Select';
import SelectLayout from './SelectLayout';
import SelectTheme from './SelectTheme';
import GotIt from './GotIt';
import Item from './Item';

import {
  EDITION,
  LAYOUT_TYPES,
  MODAL_TYPES,
  SHEET_TYPE,
  LAYOUT_PAGE_TYPE,
  MODIFICATION,
  CUSTOM_LAYOUT_TYPE
} from '@/common/constants';
import {
  getThemeOptSelectedById,
  getLayoutOptSelectedById,
  resetObjects,
  activeCanvas,
  isEmpty,
  scrollToElement,
  modifyItems
} from '@/common/utils';
import {
  usePopoverCreationTool,
  useLayoutPrompt,
  useDrawLayout,
  useGetLayouts,
  useFrame,
  useModal,
  useActionLayout
} from '@/hooks';

import {
  getCustom as getCustomLayouts,
  loadLayouts,
  loadDigitalLayouts,
  loadSupplementalLayouts
} from '@/api/layouts';

import { loadDigitalThemes, loadPrintThemes } from '@/api/themes';

import { cloneDeep } from 'lodash';

export default {
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
      type: Object,
      default: () => ({})
    }
  },
  setup({ edition }) {
    const { setToolNameSelected, selectedToolName } = usePopoverCreationTool();
    const { frames, currentFrameId } = useFrame();
    const { modalData } = useModal();
    const {
      updateVisited,
      setIsPrompt,
      pageSelected,
      themeId: defaultThemeId
    } = useLayoutPrompt(edition);
    const { drawLayout } = useDrawLayout();
    const {
      sheetLayout,
      getLayoutsByType,
      listLayouts,
      updateSheetThemeLayout
    } = useGetLayouts(edition);
    const { currentFrame } = useFrame();

    const {
      saveToFavorites,
      getFavorites,
      getPrintLayoutTypes,
      getCustom,
      getLayoutsByThemeAndType,
      getCustomAndFavoriteLayouts,
      getFavoriteLayoutTypeMenu
    } = useActionLayout();

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
      defaultThemeId,
      updateSheetThemeLayout,
      frames,
      currentFrame,
      modalData,
      currentFrameId,
      saveToFavorites,
      getFavorites,
      getPrintLayoutTypes,
      getCustom,
      getLayoutsByThemeAndType,
      getCustomAndFavoriteLayouts,
      getFavoriteLayoutTypeMenu
    };
  },
  data() {
    const isDigital = this.edition === EDITION.DIGITAL;

    return {
      themesOptions: [],
      layoutTypesOrigin: [],
      layoutTypes: [],
      disabled: false,
      disabledTheme: false,
      layoutTypeSelected: isDigital ? {} : { sub: '' },
      themeSelected: {},
      tempLayoutIdSelected: null,
      layoutEmptyLength: 4,
      layoutObjSelected: {},
      textDisplay: {
        promptMsg: '',
        promptTitle: '',
        title: '',
        optionTitle: ''
      },
      isDigital,
      layoutId: null,
      favoriteLayouts: [],
      customLayouts: [],
      layouts: []
    };
  },
  computed: {
    ...mapGetters({
      isPrompt: APP_GETTERS.IS_PROMPT,
      totalBackground: PRINT_GETTERS.TOTAL_BACKGROUND,
      printObject: PRINT_GETTERS.GET_OBJECTS
    }),
    isVisited() {
      return this.pageSelected?.isVisited;
    },
    themeId() {
      return this.pageSelected?.themeId || this.defaultThemeId;
    }
  },
  watch: {
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
    layoutTypeSelected: {
      deep: true,
      handler(newVal) {
        if (newVal.value === CUSTOM_LAYOUT_TYPE) {
          this.disabledTheme = true;
          return;
        }
        this.disabledTheme = false;
      }
    }
  },
  async mounted() {
    this.textDisplay = this.updateTextDisplay();

    await Promise.all([
      this.initEditionData(),
      this.getLayoutTypes(),
      this.getFavoritesData(),
      this.getCustomData()
    ]);

    this.filterLayoutType();

    await this.initData();

    this.autoScroll(this.layoutId);
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
    async initData() {
      this.setLayoutSelected(this.pageSelected);
      this.setDisabledLayout(this.pageSelected);
      this.setThemeSelected(this.themeId);
      this.setLayoutActive();

      await this.getLayouts();
    },
    /**
     * Set up inital data to render in view
     */
    async initEditionData() {
      this.isDigital
        ? await this.initDigitalData()
        : await this.initPrintData();
    },
    /**
     * Set up inital data to render in view of print ediont
     */
    async initPrintData() {
      this.themesOptions = await loadPrintThemes();

      const layouts = await loadLayouts();

      this.setPrintLayouts({ layouts });

      this.layoutId = this.pageSelected?.layoutId;
    },
    /**
     * Set up inital data to render in view of digital ediont
     */
    async initDigitalData() {
      this.themesOptions = await loadDigitalThemes();
      console.log(`defaultThemeId: ${this.defaultThemeId}`);

      const isSupplemental = this.initialData?.isSupplemental;

      const layouts = isSupplemental
        ? await loadSupplementalLayouts()
        : await loadDigitalLayouts();

      this.setDigitalLayouts({ layouts });

      // if layout modal is used to add frame -> set currentFrameObjet = null
      const currentFrameObj = this.modalData.props.isAddNew
        ? null
        : this.frames.find(f => f.id === this.currentFrameId);

      this.layoutId = this.initialData?.isSupplemental
        ? currentFrameObj?.frame?.supplementalLayoutId
        : this.pageSelected?.layoutId;
    },
    /**
     * Set default selected for layout base on id of sheet: Cover, Single Page or Collage
     * @param  {Number} pageSelected Id of sheet selected
     */
    setLayoutSelected(pageSelected) {
      if (this.initialData?.layoutSelected) {
        this.layoutTypeSelected = this.getSelectedType(
          this.initialData.layoutSelected
        );

        return;
      }
      const sheetType = pageSelected.type;
      switch (sheetType) {
        case SHEET_TYPE.COVER:
          {
            const coverOption = this.layoutTypes.find(
              l => l.sheetType === SHEET_TYPE.COVER
            );
            this.layoutTypeSelected = this.getSelectedType(coverOption);
          }
          break;
        case SHEET_TYPE.FRONT_COVER:
        case SHEET_TYPE.BACK_COVER:
          {
            const singlePageOption = this.layoutTypes.find(
              l => l.sheetType === SHEET_TYPE.FRONT_COVER
            );
            this.layoutTypeSelected = this.getSelectedType(singlePageOption);
          }
          break;
        default:
          {
            // Use default layout if the sheet no have private layout
            const layoutId = this.pageSelected?.layoutId;
            if (layoutId) {
              const layoutOpt = getLayoutOptSelectedById(
                this.listLayouts(),
                this.layoutTypes,
                layoutId
              );
              this.layoutTypeSelected = this.getSelectedType(layoutOpt);
            } else {
              const index = this.layoutTypes.length > 1 ? 1 : 0;

              this.layoutTypeSelected = this.getSelectedType(
                this.layoutTypes[index]
              );
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
      const isFavoritesExisted = !isEmpty(this.favoriteLayouts);
      const isCustomExisted = !isEmpty(this.customLayouts);

      if ((isFavoritesExisted || isCustomExisted) && !this.isDigital) {
        this.disabled = false;

        return;
      }

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
    async onChangeTheme(theme) {
      this.themeSelected = theme;

      await this.getLayouts();
    },
    /**
     * Set object layout selected from dropdown
     */
    async onChangeLayoutType(layout) {
      this.layoutTypeSelected = this.getSelectedType(layout);

      await this.getLayouts();
    },
    /**
     * When open layout from creation tool, check sheet has exist layout before or not
     * if not, first layout is selected, else is sheet's layout
     */
    setLayoutActive() {
      if (this.layouts.length === 0) return;

      this.tempLayoutIdSelected = this.layouts[0].id;
      this.layoutObjSelected = this.layouts[0];

      // if adding new frame, use the default setting above
      if (this.initialData?.isAddNew) return;

      if (this.layoutId) {
        const sheetLayoutObj = this.layouts.find(
          layout => layout.id === this.layoutId
        );
        if (sheetLayoutObj?.id) {
          this.tempLayoutIdSelected = sheetLayoutObj.id;
        }
      }
      this.layoutObjSelected = this.layouts.find(
        l => l.id === this.tempLayoutIdSelected
      );
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

        const isSinglePage =
          this.layoutObjSelected.pageType === LAYOUT_PAGE_TYPE.SINGLE_PAGE.id;

        const isFrontOrBackSheet = [
          SHEET_TYPE.FRONT_COVER,
          SHEET_TYPE.BACK_COVER
        ].includes(this.pageSelected?.type);

        if (!this.isDigital && !isFrontOrBackSheet && isSinglePage) {
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
          if (this.modalData?.props?.isAddNew) {
            this.$emit('addFrame', this.layoutObjSelected);
            return;
          }
          this.onCancel();
          this.toggleModal({
            isOpenModal: true,
            modalData: {
              type: MODAL_TYPES.OVERRIDE_LAYOUT,
              props: {
                sheetData: {
                  layout: cloneDeep(this.layoutObjSelected),
                  addNewFrame: true
                }
              }
            }
          });
          return;
        }

        // Prompt a modal to comfirm overriding layout if layoutId existed and in DIGITAL mode
        if (this.isDigital && this.pageSelected?.layoutId) {
          this.toggleModal({
            isOpenModal: true,
            modalData: {
              type: MODAL_TYPES.OVERRIDE_LAYOUT,
              props: {
                sheetData: {
                  sheetId: this.pageSelected?.id,
                  themeId: this.themeSelected?.id,
                  layout: cloneDeep(this.layoutObjSelected)
                }
              }
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
      if (!this.isDigital) {
        this.$root.$emit('drawLayout');
      }

      this.$root.$emit('pageNumber');
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
    },
    /**
     * Get layout refs by Id and handle auto scroll
     *
     * @param {Number} layoutId selected layout id
     */
    autoScroll(layoutId) {
      setTimeout(() => {
        const currentLayout = this.$refs[`layout${layoutId}`];

        if (isEmpty(currentLayout)) return;

        scrollToElement(currentLayout[0]?.$el, { block: 'center' });
      }, 20);
    },
    /**
     * Save / unsave the selected layout to favorites
     *
     * @param {String | Number} id id of selected layout
     */
    async onSaveToFavorites({ id }) {
      await this.saveToFavorites(id);

      this.modifyFavorites(id);

      this.setDisabledLayout(this.pageSelected);

      this.filterLayoutType();
    },
    /**
     * Modify favorite items list
     *
     * @param {String | Number} id  id of selected layout
     */
    modifyFavorites(id) {
      const index = this.favoriteLayouts.findIndex(f => id === f);

      const modification = index < 0 ? MODIFICATION.ADD : MODIFICATION.DELETE;

      this.favoriteLayouts = modifyItems(
        this.favoriteLayouts,
        id,
        index,
        modification
      );
    },
    /**
     * Check if selected layout is in favorite list
     *
     * @param   {String | Number} id  id of selected layout
     * @returns {Boolean}             is selected layout in favorite list
     */
    isInFavorites({ id }) {
      return this.favoriteLayouts.includes(id);
    },
    /**
     * Get favorites from API
     */
    async getFavoritesData() {
      this.favoriteLayouts = await this.getFavorites();
    },
    /**
     * Get custom layouts from API
     */
    async getCustomData() {
      this.customLayouts = await this.getCustom();
    },
    /**
     * Filter layout types
     */
    async filterLayoutType() {
      if (this.isDigital) {
        this.layoutTypes = this.layoutTypesOrigin;

        return;
      }

      if (isEmpty(this.favoriteLayouts) && isEmpty(this.customLayouts)) {
        this.layoutTypes = this.layoutTypesOrigin;

        return;
      }

      if (this.pageSelected.type === SHEET_TYPE.NORMAL) {
        const opts = [...this.layoutTypesOrigin];

        const extraMenu = await this.getFavoriteLayoutTypeMenu(
          SHEET_TYPE.NORMAL
        );

        opts.push(extraMenu);

        this.layoutTypes = opts;

        return;
      }

      const sheetType =
        this.pageSelected.type === SHEET_TYPE.BACK_COVER
          ? SHEET_TYPE.FRONT_COVER
          : this.pageSelected.type;

      const opts = this.layoutTypesOrigin.filter(lo => {
        return lo.sheetType === sheetType;
      });

      const extraMenu = await this.getFavoriteLayoutTypeMenu(
        this.pageSelected.type
      );

      opts.push(extraMenu);

      this.layoutTypes = opts;
    },
    /**
     * Get layout types from API
     */
    async getLayoutTypes() {
      const layoutTypes = await this.getPrintLayoutTypes();

      if (!this.isDigital) {
        this.layoutTypesOrigin = layoutTypes.map(lt => ({
          ...lt,
          subItems: []
        }));
        this.layoutTypes = this.layoutTypesOrigin;

        return;
      }

      this.layoutTypesOrigin = this.initialData?.isSupplemental
        ? layoutTypes
        : layoutTypes.filter(
            l => l.value !== LAYOUT_TYPES.SUPPLEMENTAL_LAYOUTS.value
          );

      this.layoutTypes = this.layoutTypesOrigin;
    },
    /**
     * Get page type selected value
     *
     * @param   {Object}  selectedData  selected page type data
     * @returns {Object}                page type value
     */
    getSelectedType(selectedData) {
      if (this.isDigital) return selectedData;

      if (isEmpty(selectedData)) return { sub: '' };

      return { value: selectedData.value, sub: selectedData.sub?.value };
    },
    /**
     * Get layout from API
     */
    async getLayouts() {
      if (
        isEmpty(this.themeSelected?.id) ||
        isEmpty(this.layoutTypeSelected?.value)
      ) {
        this.layouts = [];

        return;
      }

      if (this.isDigital) {
        this.layouts = await this.getLayoutsByType(
          this.themeSelected.id,
          this.layoutTypeSelected.value
        );

        return;
      }

      if (isEmpty(this.layoutTypeSelected.sub)) {
        this.layouts = await this.getLayoutsByThemeAndType(
          this.themeSelected.id,
          this.layoutTypeSelected.value
        );

        return;
      }

      const layouts = await this.getCustomAndFavoriteLayouts(
        this.layoutTypeSelected.sub
      );

      this.layouts = layouts.map(l => ({ ...l, isFavoritesDisabled: true }));
    }
  }
};
