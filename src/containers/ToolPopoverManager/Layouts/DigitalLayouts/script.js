import { mapMutations } from 'vuex';

import { MUTATES as THEME_MUTATES } from '@/store/modules/theme/const';

import Layouts from '@/components/ToolPopovers/Layout';

import {
  EDITION,
  MODAL_TYPES,
  SHEET_TYPE,
  CUSTOM_LAYOUT_TYPE
} from '@/common/constants';
import {
  getThemeOptSelectedById,
  resetObjects,
  isEmpty,
  entitiesToObjects
} from '@/common/utils';
import {
  usePopoverCreationTool,
  useLayoutPrompt,
  useGetLayouts,
  useFrame,
  useModal,
  useActionLayout
} from '@/hooks';

import { loadDigitalLayouts, loadSupplementalLayouts } from '@/api/layouts';

import { loadDigitalThemes } from '@/api/themes';

// for digital. After implement saving feature, this code can be remove
import { DIGITAL_LAYOUT_TYPES as LAYOUT_TYPES } from '@/mock/layoutTypes';

import { cloneDeep } from 'lodash';

export default {
  components: {
    Layouts
  },
  props: {
    initialData: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const edition = EDITION.DIGITAL;

    const { setToolNameSelected, selectedToolName } = usePopoverCreationTool();
    const { frames, currentFrame, currentFrameId } = useFrame();
    const { toggleModal, modalData } = useModal();
    const {
      isPrompt,
      updateVisited,
      setIsPrompt,
      pageSelected,
      themeId: defaultThemeId
    } = useLayoutPrompt(edition);
    const { getLayoutsByType, updateSheetThemeLayout } = useGetLayouts(edition);

    const {
      getDigitalLayoutTypes,
      getCustom,
      getLayoutsByThemeAndType,
      getCustomAndFavoriteLayouts
    } = useActionLayout();

    return {
      isPrompt,
      toggleModal,
      selectedToolName,
      setToolNameSelected,
      updateVisited,
      setIsPrompt,
      pageSelected,
      getLayoutsByType,
      defaultThemeId,
      updateSheetThemeLayout,
      frames,
      currentFrame,
      modalData,
      currentFrameId,
      getDigitalLayoutTypes,
      getCustom,
      getLayoutsByThemeAndType,
      getCustomAndFavoriteLayouts
    };
  },
  data() {
    const textDisplay = {
      promptMsg:
        'The best way to get started is by selecting a screen layout. As a shortcut, the screens from your selecting theme will be presented first.',
      promptTitle: 'Select a Screen Layout',
      title: 'Screen Layouts',
      optionTitle: 'Screen Type:'
    };

    return {
      themesOptions: [],
      layoutTypesOrigin: [],
      layoutTypes: [],
      disabled: false,
      disabledTheme: false,
      layoutTypeSelected: {},
      themeSelected: {},
      textDisplay,
      layoutId: null,
      customLayouts: [],
      layouts: [],
      favoriteLayouts: []
    };
  },
  computed: {
    isVisited() {
      return this.pageSelected?.isVisited;
    },
    themeId() {
      return this.pageSelected.themeId || this.defaultThemeId;
    },
    isSupplemental() {
      return this.initialData.isSupplemental;
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
    await Promise.all([
      this.initDigitalData(),
      this.getLayoutTypes(),
      this.getCustomData()
    ]);

    await this.filterLayoutType();

    await this.initData();
  },
  methods: {
    ...mapMutations({
      setDigitalLayouts: THEME_MUTATES.DIGITAL_LAYOUTS
    }),
    /**
     * Set up inital data to render in view
     */
    async initData() {
      await this.setLayoutSelected(this.pageSelected);
      this.setDisabledLayout(this.pageSelected);
      this.setThemeSelected(this.themeId);

      await this.getLayouts();
    },
    /**
     * Set up inital data to render in view of digital ediont
     */
    async initDigitalData() {
      this.themesOptions = await loadDigitalThemes();

      const layouts = this.isSupplemental
        ? await loadSupplementalLayouts()
        : await loadDigitalLayouts();

      this.setDigitalLayouts({ layouts });
    },
    /**
     * Set default selected for layout base on id of sheet: Cover, Single Page or Collage
     * @param  {Object} pageSelected current selected sheet
     */
    async setLayoutSelected(pageSelected) {
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
            const index = this.layoutTypes.length > 1 ? 1 : 0;

            this.layoutTypeSelected = this.getSelectedType(
              this.layoutTypes[index]
            );
          }
          break;
      }
    },
    /**
     * Set disabled select layout base on id of sheet are cover or half-sheet
     * @param  {Object} pageSelected current selected sheet
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
     * @param  {Number} currentSheetThemeId Theme id of the current sheet
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
     * @param {Object} theme theme that is selecting in the theme select box
     */
    async onChangeTheme(theme) {
      this.themeSelected = theme;

      await this.getLayouts();
    },
    /**
     * Set object layout selected from dropdown
     * @param {Object} layout layout type that is selecting in the layout type box
     */
    async onChangeLayoutType(layout) {
      this.layoutTypeSelected = this.getSelectedType(layout);

      await this.getLayouts();
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
     * @param {Object} layoutData layout that is selected
     */
    setThemeLayoutForSheet(layoutData) {
      if (isEmpty(this.layouts)) return;

      const layout = cloneDeep(layoutData);

      layout.frames.forEach(f => (f.objects = entitiesToObjects(f.objects)));

      const isSupplemental =
        layout.type === LAYOUT_TYPES.SUPPLEMENTAL_LAYOUTS.value;

      const hasPackageFrame = this.frames.some(f => f.fromLayout);

      if (!isSupplemental && hasPackageFrame) {
        this.applyLayout(layout);

        this.onCancel();

        return;
      }

      // handle case: user add new suppblemental frame
      if (isSupplemental && this.modalData?.props?.isAddFrame) {
        this.$emit('addFrame', layout);

        return;
      }

      this.onCancel();

      const sheetData = isSupplemental
        ? { isReplaceFrame: true }
        : { sheetId: this.pageSelected?.id, themeId: this.themeSelected?.id };

      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.OVERRIDE_LAYOUT,
          props: {
            sheetData: {
              layout,
              ...sheetData
            }
          }
        }
      });
    },
    /**
     * Save objects to store and draw on canvas
     * @param {Object} layout layout will be stored & applied on canvas
     */
    applyLayout(layout) {
      this.updateSheetThemeLayout({
        sheetId: this.pageSelected?.id,
        themeId: this.themeSelected?.id,
        layout
      });

      resetObjects();

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
     * Get custom layouts from API
     */
    async getCustomData() {
      this.customLayouts = await this.getCustom();
    },
    /**
     * Filter layout types
     */
    async filterLayoutType() {
      this.layoutTypes = this.layoutTypesOrigin;
    },

    /**
     * Get layout types from API
     */
    async getLayoutTypes() {
      const layoutTypes = await this.getDigitalLayoutTypes();

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
      return selectedData;
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

      this.layouts = await this.getLayoutsByType(
        this.themeSelected.id,
        this.layoutTypeSelected.value
      );
    },
    /**
     * Save / unsave the selected layout to favorites
     *
     * @param {String | Number} id id of selected layout
     */
    async onSaveToFavorites(id) {
      id;
      // handle save favorite layout
    }
  }
};
