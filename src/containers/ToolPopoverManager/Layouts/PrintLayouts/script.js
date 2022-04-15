import { mapGetters } from 'vuex';
import { cloneDeep } from 'lodash';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import Layouts from '@/components/ToolPopovers/Layout';

import {
  CUSTOM_LAYOUT_TYPE,
  EDITION,
  LAYOUT_TYPES,
  SAVED_AND_FAVORITES_TYPE,
  MODAL_TYPES
} from '@/common/constants';
import {
  getThemeOptSelectedById,
  isEmpty,
  insertItemsToArray,
  removeItemsFormArray,
  isHalfSheet,
  getLayoutSelected
} from '@/common/utils';
import {
  usePopoverCreationTool,
  useLayoutPrompt,
  useModal,
  useActionLayout,
  useCustomLayout,
  useLayoutElements,
  useApplyPrintLayout,
  useGetLayouts
} from '@/hooks';

import { getThemesApi } from '@/api/theme';

import { changeObjectsCoords } from '@/common/utils/layout';

export default {
  components: {
    Layouts
  },
  setup() {
    const edition = EDITION.PRINT;

    const { setToolNameSelected, selectedToolName } = usePopoverCreationTool();
    const { modalData, toggleModal } = useModal();
    const {
      isPrompt,
      updateVisited,
      setIsPrompt,
      pageSelected,
      themeId: defaultThemeId
    } = useLayoutPrompt(edition);

    const { getLayoutElements } = useLayoutElements();

    const {
      saveToFavorites,
      deleteFavorites,
      getFavoriteLayouts
    } = useActionLayout();
    const { getCustom } = useCustomLayout();
    const { applyPrintLayout } = useApplyPrintLayout();
    const { getPrintLayouts } = useGetLayouts();

    return {
      isPrompt,
      selectedToolName,
      setToolNameSelected,
      updateVisited,
      setIsPrompt,
      pageSelected,
      defaultThemeId,
      applyPrintLayout,
      getPrintLayouts,
      modalData,
      toggleModal,
      saveToFavorites,
      deleteFavorites,
      getCustom,
      getFavoriteLayouts,
      getLayoutElements
    };
  },
  data() {
    const textDisplay = {
      promptMsg:
        'The best way to get started is by selecting a layout. As a shortcut, the layouts from your selecting theme will be presented first.',
      promptTitle: 'Select a Layout',
      title: 'Layouts',
      optionTitle: 'Layout Type:'
    };
    return {
      themesOptions: [],
      layoutTypesOrigin: [],
      layoutTypes: [],
      disabledTheme: false,
      layoutTypeSelected: { sub: '' },
      themeSelected: {},
      textDisplay,
      layoutId: null,
      favoriteLayouts: [],
      customLayouts: [],
      layouts: []
    };
  },
  computed: {
    ...mapGetters({
      totalBackground: PRINT_GETTERS.TOTAL_BACKGROUND,
      printObject: PRINT_GETTERS.GET_OBJECTS
    }),
    isVisited() {
      return this.pageSelected?.isVisited;
    },
    themeId() {
      return this.defaultThemeId;
    },
    isHalfSheet() {
      return this.pageSelected && isHalfSheet(this.pageSelected);
    },
    tabActive() {
      return this.isHalfSheet ? 1 : 0;
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
      this.initPrintData(),
      this.getFavoritesData(),
      this.getCustomData()
    ]);

    this.getLayoutTypes();

    await this.filterLayoutType();

    await this.initData();
  },
  methods: {
    /**
     * Set up inital data to render in view
     */
    async initData() {
      await this.setThemeSelected(this.themeId);
      this.setLayoutSelected();

      await this.getLayouts();
    },
    /**
     * Set up inital data to render in view
     */
    async initPrintData() {
      this.themesOptions = await getThemesApi(false);
    },
    /**
     * Set default selected for layout base on id of sheet: Cover, Single Page or Collage
     */
    setLayoutSelected() {
      const type = getLayoutSelected(this.pageSelected, this.layoutTypes);
      this.layoutTypeSelected = this.getSelectedType(type);
    },

    /**
     * Set default selected for theme base on id of sheet. Use default theme when the sheet not have private theme
     * @param  {Number} currentSheetThemeId Theme id of the current sheet
     */
    async setThemeSelected(currentSheetThemeId) {
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

      await this.filterLayoutType();
    },
    /**
     * Set object theme selected from dropdown
     * @param {Object} theme theme that is selecting in the theme select box
     */
    async onChangeTheme(theme) {
      this.themeSelected = theme;

      await this.filterLayoutType();

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
      if (this.layouts.length === 0) return;

      const layout = cloneDeep(layoutData);

      layout.objects = await this.getLayoutElements(layout.id);

      // change objects coords if user at FRONT_COVER or BACK_COVER
      if (this.isHalfSheet) {
        layout.objects = changeObjectsCoords(
          layout.objects,
          this.pageSelected.type
        );
      }
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.APPLY_LAYOUT,
          props: {
            themeId: this.themeSelected?.id,
            layout: layout
          }
        }
      });

      this.onCancel();
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
     * Save / unsave the selected layout to favorites
     *
     * @param {String | Number} id id of selected layout
     */
    async onSaveToFavorites({ id, isFavorites }) {
      const isSuccess = isFavorites
        ? await this.saveToFavorites(id)
        : await this.deleteFavorites(id);

      if (!isSuccess) return;

      await this.getLayouts();

      if (isEmpty(this.layouts)) {
        this.setLayoutSelected();
        await this.getLayouts();
      }

      this.modifyFavorites(id);

      await this.filterLayoutType();
    },
    /**
     * Modify favorite items list
     *
     * @param {String | Number} id  id of selected layout
     */
    modifyFavorites(id) {
      const index = this.favoriteLayouts.findIndex(f => id === f);

      if (index < 0) {
        this.favoriteLayouts = insertItemsToArray(this.favoriteLayouts, [
          { value: id }
        ]);
      } else {
        this.favoriteLayouts = removeItemsFormArray(this.favoriteLayouts, [
          { value: id, index }
        ]);
      }
    },
    /**
     * Get favorites from API
     */
    async getFavoritesData() {
      const favoriteLayouts = await this.getFavoriteLayouts();
      this.favoriteLayouts = favoriteLayouts.map(({ id }) => id);
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
      let layoutTypeOpts = [...this.layoutTypesOrigin];

      if (!isEmpty(this.favoriteLayouts) || !isEmpty(this.customLayouts)) {
        layoutTypeOpts.push(SAVED_AND_FAVORITES_TYPE);
      }

      this.layoutTypes = layoutTypeOpts;
    },
    /**
     * Get layout types
     */
    getLayoutTypes() {
      this.layoutTypesOrigin = Object.values(LAYOUT_TYPES).map(lt => ({
        ...lt,
        subItems: []
      }));

      this.layoutTypes = this.layoutTypesOrigin;
    },
    /**
     * Get page type selected value
     *
     * @param   {Object}  selectedData  selected page type data
     * @returns {Object}                page type value
     */
    getSelectedType(selectedData) {
      if (isEmpty(selectedData)) return { sub: '' };

      return { value: selectedData.value, sub: selectedData.sub?.value };
    },
    /**
     * Get layout from API
     */
    async getLayouts() {
      this.layouts = await this.getPrintLayouts(
        this.themeSelected?.id,
        this.layoutTypeSelected?.value
      );
    },
    /**
     * To get favorites and custom layouts
     *
     * @returns array of layouts
     */
    async getFavAndCustomLayouts() {
      const favLayouts = await this.getFavoriteLayouts();
      return [...favLayouts, ...this.customLayouts];
    }
  }
};
