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
  useActionLayout,
  useCustomLayout,
  useApplyDigitalLayout
} from '@/hooks';

import {
  loadDigitalLayouts,
  loadSupplementalLayouts
} from '@/api/layoutService';

import { getThemesApi } from '@/api/theme';

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
    const { updateSheetThemeLayout } = useGetLayouts(edition);

    const { getCustomAndFavoriteLayouts } = useActionLayout();
    const { getCustomDigitalLayout } = useCustomLayout();
    const { applyDigitalLayout } = useApplyDigitalLayout();

    return {
      isPrompt,
      toggleModal,
      selectedToolName,
      setToolNameSelected,
      updateVisited,
      setIsPrompt,
      pageSelected,
      defaultThemeId,
      updateSheetThemeLayout,
      frames,
      currentFrame,
      modalData,
      currentFrameId,
      getCustomDigitalLayout,
      getCustomAndFavoriteLayouts,
      applyDigitalLayout
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
      return this.defaultThemeId;
    },
    isSupplemental() {
      return this.initialData?.isSupplemental;
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
        if (newVal?.value === CUSTOM_LAYOUT_TYPE) {
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

    this.filterLayoutType();

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
      this.setLayoutSelected();
      this.setDisabledLayout(this.pageSelected);
      this.setThemeSelected(this.themeId);

      await this.getLayouts();
    },
    /**
     * Set up inital data to render in view of digital ediont
     */
    async initDigitalData() {
      this.themesOptions = await getThemesApi(true);

      const layouts = this.isSupplemental
        ? loadSupplementalLayouts()
        : loadDigitalLayouts();

      this.setDigitalLayouts({ layouts });
    },
    /**
     * Set default selected for layout base on id of sheet: Cover, Single Page or Collage
     */
    setLayoutSelected() {
      this.layoutTypeSelected = this.getSelectedType(this.layoutTypes[0]);
    },
    /**
     * Set disabled select layout base on id of sheet are cover or half-sheet
     * @param  {Object} pageSelected current selected sheet
     */
    setDisabledLayout(pageSelected) {
      this.disabled =
        this.initialData?.disabled ??
        this.isSupplemental ??
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

      this.filterLayoutType();
    },
    /**
     * Set object theme selected from dropdown
     * @param {Object} theme theme that is selecting in the theme select box
     */
    async onChangeTheme(theme) {
      this.themeSelected = theme;

      this.filterLayoutType();
      this.setLayoutSelected();
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
    async setThemeLayoutForSheet(layoutData) {
      if (isEmpty(this.layouts)) return;

      const layout = cloneDeep(layoutData);

      layout.frames.forEach(f => (f.objects = entitiesToObjects(f.objects)));

      const isSupplemental = layout.isSupplemental;

      const hasPackageFrame = this.frames.some(f => f.fromLayout);

      if (!isSupplemental && hasPackageFrame) {
        await this.applyDigitalLayout(layout);

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
      this.customLayouts = await this.getCustomDigitalLayout();
    },
    /**
     * Filter layout types
     */
    filterLayoutType() {
      const layoutTypeOpts = [...this.layoutTypesOrigin];

      if (!isEmpty(this.favoriteLayouts) || !isEmpty(this.customLayouts)) {
        layoutTypeOpts.push({
          name: 'Saved Layouts/Favorites',
          id: -999,
          value: -999
        });
      }

      this.layoutTypes = layoutTypeOpts;
    },

    /**
     * Get layout types from API
     */
    async getLayoutTypes() {
      // call api to get alyout types
      const layoutTypes = [];

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
      const customPackage = this.customLayouts.filter(
        layout => !layout.isSupplemental
      );
      const customSupplemental = this.customLayouts.filter(
        layout => layout.isSupplemental
      );
      this.layouts = this.isSupplemental ? customSupplemental : customPackage;
    },
    /**
     * Save / unsave the selected layout to favorites
     *
     * @param {String | Number} id id of selected layout
     */
    async onSaveToFavorites() {
      // handle save favorite layout
    }
  }
};
