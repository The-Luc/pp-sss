import { mapGetters } from 'vuex';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import Layouts from '@/components/ToolPopovers/Layout';

import {
  MODAL_TYPES,
  SHEET_TYPE,
  LAYOUT_PAGE_TYPE,
  CUSTOM_LAYOUT_TYPE,
  EDITION
} from '@/common/constants';
import {
  getThemeOptSelectedById,
  getLayoutOptSelectedById,
  resetObjects,
  isEmpty,
  insertItemsToArray,
  removeItemsFormArray,
  isHalfSheet,
  entitiesToObjects
} from '@/common/utils';
import {
  usePopoverCreationTool,
  useLayoutPrompt,
  useGetLayouts,
  useModal,
  useActionLayout
} from '@/hooks';

import { getCustom as getCustomLayouts } from '@/api/layouts';

import { loadPrintThemes } from '@/api/themes';

import { cloneDeep } from 'lodash';
import { changeObjectsCoords } from '@/common/utils/layout';
import { layoutService } from '@/api/layout';

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
    const {
      getLayoutsByType,
      listLayouts,
      updateSheetThemeLayout
    } = useGetLayouts(edition);

    const {
      saveToFavorites,
      getFavorites,
      getCustom,
      getCustomAndFavoriteLayouts,
      getFavoriteLayoutTypeMenu
    } = useActionLayout();

    return {
      isPrompt,
      selectedToolName,
      setToolNameSelected,
      updateVisited,
      setIsPrompt,
      pageSelected,
      getLayoutsByType,
      listLayouts,
      defaultThemeId,
      updateSheetThemeLayout,
      modalData,
      toggleModal,
      saveToFavorites,
      getFavorites,
      getCustom,
      getCustomAndFavoriteLayouts,
      getFavoriteLayoutTypeMenu
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
      disabled: false,
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
      return this.pageSelected?.themeId || this.defaultThemeId;
    },
    isHalfSheet() {
      return isHalfSheet({ type: this.pageSelected?.type });
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
      this.getLayoutTypes(),
      this.getFavoritesData(),
      this.getCustomData()
    ]);

    await this.filterLayoutType();

    await this.initData();
  },
  methods: {
    /**
     * Set up inital data to render in view
     */
    async initData() {
      await this.setThemeSelected(this.themeId);
      await this.setLayoutSelected();
      this.setDisabledLayout(this.pageSelected);

      await this.getLayouts();
    },
    /**
     * Set up inital data to render in view
     */
    async initPrintData() {
      this.themesOptions = await loadPrintThemes();

      this.layoutId = this.pageSelected?.layoutId;
    },
    /**
     * Set default selected for layout base on id of sheet: Cover, Single Page or Collage
     */
    async setLayoutSelected() {
      if (isEmpty(this.layoutId)) {
        this.layoutTypeSelected = this.getSelectedType(this.layoutTypes[0]);

        return;
      }

      const customLayouts = await getCustomLayouts();

      const layoutOpt = getLayoutOptSelectedById(
        [...this.layouts, ...customLayouts],
        this.layoutTypes,
        this.layoutId
      );

      this.layoutTypeSelected = this.getSelectedType(layoutOpt);
    },

    /**
     * Set disabled select layout base on id of sheet are cover or half-sheet
     * @param  {Object} pageSelected current selected sheet
     */
    setDisabledLayout(pageSelected) {
      const isFavoritesExisted = !isEmpty(this.favoriteLayouts);
      const isCustomExisted = !isEmpty(this.customLayouts);

      if (isFavoritesExisted || isCustomExisted) {
        this.disabled = false;

        return;
      }

      this.disabled = [
        SHEET_TYPE.COVER,
        SHEET_TYPE.FRONT_COVER,
        SHEET_TYPE.BACK_COVER
      ].includes(pageSelected.type);
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
      await this.getLayoutTypes();
    },
    /**
     * Set object theme selected from dropdown
     * @param {Object} theme theme that is selecting in the theme select box
     */
    async onChangeTheme(theme) {
      this.themeSelected = theme;

      await this.getLayoutTypes();
      await this.setLayoutSelected();
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
      if (this.layouts.length === 0) return;

      const layout = cloneDeep(layoutData);

      layout.objects = entitiesToObjects(layout.objects);

      // change objects coords if user at FRONT_COVER or BACK_COVER
      if (this.isHalfSheet) {
        layout.objects = changeObjectsCoords(
          layout.objects,
          this.pageSelected.type,
          window.printCanvas
        );
      }

      // confirm reset layout if there are any backgrounds or objects on canvas
      if (this.totalBackground || !isEmpty(this.printObject)) {
        this.onCancel();
        this.toggleModal({
          isOpenModal: true,
          modalData: {
            type: MODAL_TYPES.RESET_LAYOUT,
            props: {
              pageSelected: this.pageSelected,
              sheetId: this.pageSelected?.id,
              themeId: this.themeSelected?.id,
              layout
            }
          }
        });
        return;
      }

      const isSinglePage = layout.pageType === LAYOUT_PAGE_TYPE.SINGLE_PAGE.id;

      if (!this.isHalfSheet && isSinglePage) {
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
              layout
            }
          }
        });
        return;
      }

      this.applyLayout(layout);

      this.onCancel();
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

      // draw layout on canvas
      this.$root.$emit('drawLayout');

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
     * Save / unsave the selected layout to favorites
     *
     * @param {String | Number} id id of selected layout
     */
    async onSaveToFavorites(id) {
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
      if (this.pageSelected.type === SHEET_TYPE.NORMAL) {
        const layoutTypeOpts = [...this.layoutTypesOrigin];

        if (!isEmpty(this.favoriteLayouts) || !isEmpty(this.customLayouts)) {
          const extraMenu = await this.getFavoriteLayoutTypeMenu(
            SHEET_TYPE.NORMAL
          );

          layoutTypeOpts.push(extraMenu);
        }

        this.layoutTypes = layoutTypeOpts;

        return;
      }

      const sheetType =
        this.pageSelected.type === SHEET_TYPE.BACK_COVER
          ? SHEET_TYPE.FRONT_COVER
          : this.pageSelected.type;

      const opts = this.layoutTypesOrigin.filter(lo => {
        return lo.sheetType === sheetType;
      });

      if (!isEmpty(this.favoriteLayouts) || !isEmpty(this.customLayouts)) {
        const extraMenu = await this.getFavoriteLayoutTypeMenu(
          this.pageSelected.type
        );

        opts.push(extraMenu);
      }

      this.layoutTypes = opts;
    },
    /**
     * Get layout types from API
     */
    async getLayoutTypes() {
      const layoutTypes = await layoutService.getPrintLayoutTypes(
        this.themeSelected.id
      );

      this.layoutTypesOrigin = layoutTypes.map(lt => ({
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
      if (
        isEmpty(this.themeSelected?.id) ||
        isEmpty(this.layoutTypeSelected?.value)
      ) {
        this.layouts = [];

        return;
      }

      if (isEmpty(this.layoutTypeSelected.sub)) {
        this.layouts = await layoutService.getLayoutsByThemeAndType(
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
