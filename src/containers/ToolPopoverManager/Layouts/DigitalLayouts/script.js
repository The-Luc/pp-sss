import { mapMutations } from 'vuex';

import { MUTATES as THEME_MUTATES } from '@/store/modules/theme/const';

import Layouts from '@/components/ToolPopovers/Layout';

import {
  EDITION,
  MODAL_TYPES,
  CUSTOM_LAYOUT_TYPE,
  DIGITAL_LAYOUT_TYPES as LAYOUT_TYPES,
  SAVED_AND_FAVORITES_TYPE
} from '@/common/constants';
import {
  getThemeOptSelectedById,
  isEmpty,
  entitiesToObjects,
  getLayoutSelected
} from '@/common/utils';
import {
  usePopoverCreationTool,
  useLayoutPrompt,
  useFrame,
  useFrameAction,
  useModal,
  useCustomLayout,
  useGetLayouts,
  useApplyDigitalLayout,
  useObjectProperties,
  useGetDigitalLayouts
} from '@/hooks';

import { getThemesApi } from '@/api/theme';

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
    const { getSheetFrames } = useFrameAction();
    const { toggleModal, modalData } = useModal();
    const {
      isPrompt,
      updateVisited,
      setIsPrompt,
      pageSelected,
      themeId: defaultThemeId
    } = useLayoutPrompt(edition);

    const { getCustomDigitalLayout } = useCustomLayout();
    const { applyDigitalLayout } = useApplyDigitalLayout();
    const { listObjects } = useObjectProperties();
    const { getDigitalLayouts } = useGetLayouts();
    const { getDigitalLayoutElements } = useGetDigitalLayouts();

    return {
      isPrompt,
      toggleModal,
      selectedToolName,
      setToolNameSelected,
      updateVisited,
      setIsPrompt,
      pageSelected,
      defaultThemeId,
      frames,
      currentFrame,
      modalData,
      currentFrameId,
      getCustomDigitalLayout,
      getSheetFrames,
      applyDigitalLayout,
      listObjects,
      getDigitalLayouts,
      getDigitalLayoutElements
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
    await Promise.all([this.initDigitalData(), this.getCustomData()]);

    this.getLayoutTypes();
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
      this.setDisabledLayout();
      this.setThemeSelected(this.themeId);

      await this.getLayouts();
    },
    /**
     * Set up inital data to render in view of digital ediont
     */
    async initDigitalData() {
      this.themesOptions = await getThemesApi(true);
    },
    /**
     * Set default selected for layout base on id of sheet: Cover, Single Page or Collage
     */
    setLayoutSelected() {
      if (this.isSupplemental) {
        this.layoutTypeSelected = this.layoutTypes[0];
        return;
      }

      this.layoutTypeSelected = getLayoutSelected(
        this.pageSelected,
        this.layoutTypes
      );
    },
    /**
     * Set disabled select layout base on id of sheet are cover or half-sheet
     */
    setDisabledLayout() {
      const isCustomExisted = !isEmpty(this.customLayouts);

      if (isCustomExisted) {
        this.disabled = false;
        return;
      }

      this.disabled = this.initialData?.disabled ?? this.isSupplemental;
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

      this.setLayoutSelected();
      await this.getLayouts();
    },
    /**
     * Set object layout selected from dropdown
     * @param {Object} type layout type that is selecting in the layout type box
     */
    async onChangeLayoutType(type) {
      this.layoutTypeSelected = type;

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

      const layoutEl = await this.getDigitalLayoutElements(layoutData.id);

      const layout = cloneDeep(layoutEl);

      layout.frames.forEach(f => (f.objects = entitiesToObjects(f.objects)));

      const isSupplemental = layout.isSupplemental || this.isSupplemental;

      const shouldShowConfirm = await this.shouldShowConfirmationDialog();

      if (!isSupplemental && !shouldShowConfirm) {
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
      let layoutTypeOpts = [...this.layoutTypesOrigin];

      if (this.isSupplemental) {
        layoutTypeOpts = [];
        layoutTypeOpts.push(LAYOUT_TYPES.SUPPLEMENTAL_LAYOUTS);
      }

      if (!isEmpty(this.favoriteLayouts) || !isEmpty(this.customLayouts)) {
        layoutTypeOpts.push(SAVED_AND_FAVORITES_TYPE);
      }

      this.layoutTypes = layoutTypeOpts;
    },

    /**
     * Get layout types
     */
    getLayoutTypes() {
      const layoutTypes = Object.values(LAYOUT_TYPES).map(lt => ({
        ...lt,
        subItems: []
      }));

      this.layoutTypesOrigin = this.initialData?.isSupplemental
        ? layoutTypes
        : layoutTypes.filter(
            l => l.value !== LAYOUT_TYPES.SUPPLEMENTAL_LAYOUTS.value
          );

      this.layoutTypes = this.layoutTypesOrigin;
    },
    /**
     * Get layout from API
     */
    async getLayouts() {
      this.layouts = await this.getDigitalLayouts(
        this.themeSelected?.id,
        this.layoutTypeSelected?.value,
        this.isSupplemental
      );
    },
    /**
     * Save / unsave the selected layout to favorites
     *
     * @param {String | Number} id id of selected layout
     */
    async onSaveToFavorites() {
      // handle save favorite layout
    },

    /**
     *  To check whether to show confirmation modal before applying layout or not
     */
    async shouldShowConfirmationDialog() {
      const dbFrames = await this.getSheetFrames(this.pageSelected.id);
      const originalFrames = dbFrames.filter(
        frame => frame.fromLayout && frame.id !== this.currentFrameId
      );

      const isEmptyFramesObject = originalFrames.every(frame =>
        isEmpty(frame.objects)
      );

      const isCurrentFrameFromLayout = this.currentFrame.fromLayout;

      const isCurrFrameEmpty =
        isCurrentFrameFromLayout && isEmpty(this.listObjects);

      return !isCurrFrameEmpty || !isEmptyFramesObject;
    }
  }
};
