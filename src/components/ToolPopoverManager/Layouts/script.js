import { mapGetters } from 'vuex';

import { GETTERS as THEME_GETTERS } from '@/store/modules/theme/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import { THEMES_LIST } from '@/mock/themesList';
import PpToolPopover from '@/components/ToolPopover';
import PpSelect from '@/components/Select';
import SelectLayout from './SelectLayout';
import SelectTheme from './SelectTheme';
import Item from './Item';
import { LAYOUT_TYPES_OPTIONs } from '@/mock/layoutTypes';
import { LAYOUT_TYPES, TOOL_NAME } from '@/common/constants';

export default {
  components: {
    PpToolPopover,
    PpSelect,
    Item,
    SelectTheme,
    SelectLayout
  },
  data() {
    return {
      themesOptions: THEMES_LIST,
      layoutsOpt: LAYOUT_TYPES_OPTIONs,
      disabled: false,
      layoutSelected: {},
      themeSelected: {},
      tempLayoutIdSelected: null
    };
  },
  computed: {
    ...mapGetters({
      themes: THEME_GETTERS.GET_THEMES,
      book: BOOK_GETTERS.BOOK_DETAIL,
      pageSelected: BOOK_GETTERS.GET_PAGE_SELECTED,
      selectedToolName: APP_GETTERS.SELECTED_TOOL_NAME,
      sheetLayout: BOOK_GETTERS.SHEET_LAYOUT,
      sheetTheme: BOOK_GETTERS.SHEET_THEME,
      getLayoutByType: BOOK_GETTERS.GET_LAYOUT_BY_TYPE
    }),

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
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
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
      const { coverId, insideBackCoverId, insideFrontCoverId } = this.book;
      switch (pageSelected) {
        case coverId:
          {
            const coverOption = this.layoutsOpt.find(
              l => l.value === LAYOUT_TYPES.COVER.value
            );
            this.layoutSelected = coverOption;
          }
          break;
        case insideBackCoverId:
        case insideFrontCoverId:
          {
            const singlePageOption = this.layoutsOpt.find(
              l => l.value === LAYOUT_TYPES.SINGLE_PAGE.value
            );
            this.layoutSelected = singlePageOption;
          }
          break;
        default:
          {
            // Use default layout if the sheet no have private layout
            const currentSheetLayout = this.sheetLayout(pageSelected);
            if (currentSheetLayout) {
              this.layoutSelected = currentSheetLayout;
            } else {
              const collageOption = this.layoutsOpt.find(
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
      const { coverId, insideBackCoverId, insideFrontCoverId } = this.book;
      const isDisabled = [
        coverId,
        insideBackCoverId,
        insideFrontCoverId
      ].includes(pageSelected);
      this.disabled = isDisabled;
    },
    /**
     * Set default selected for theme base on id of sheet. Use default theme when the sheet not have private theme
     * @param  {Number} pageSelected Id of sheet selected
     */
    setThemeSelected(pageSelected) {
      const currentSheetTheme = this.sheetTheme(pageSelected);
      const defaultThemeId = this.book.printData.theme;
      if (currentSheetTheme) {
        this.themeSelected = currentSheetTheme;
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
        const sheetLayout = this.sheetLayout(this.pageSelected);
        if (sheetLayout) {
          const isExistInLayouts = this.layouts.find(
            layout => layout.id === sheetLayout
          );
          this.tempLayoutIdSelected = isExistInLayouts;
        }
      }
    },
    /**
     * Set current layout active when user click layout which they want change
     */
    onSelectLayout(layout) {
      this.tempLayoutIdSelected = layout.id;
    }
  }
};
