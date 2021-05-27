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
  computed: {
    ...mapGetters({
      themes: THEME_GETTERS.GET_THEMES,
      book: BOOK_GETTERS.BOOK_DETAIL,
      pageSelected: BOOK_GETTERS.GET_PAGE_SELECTED,
      selectedToolName: APP_GETTERS.SELECTED_TOOL_NAME,
      sheetLayout: BOOK_GETTERS.SHEET_LAYOUT
    })
  },
  watch: {
    selectedToolName(val) {
      if (val && val === TOOL_NAME.LAYOUTS) {
        this.initData();
      }
    }
  },
  data() {
    return {
      themesOptions: THEMES_LIST,
      layouts: LAYOUT_TYPES_OPTIONs,
      isCover: false,
      isSinglePage: false,
      disabled: false,
      layoutSelected: {},
      themeSelected: {}
    };
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
            const coverOption = this.layouts.find(
              l => l.value === LAYOUT_TYPES.COVER.value
            );
            this.layoutSelected = coverOption;
          }
          break;
        case insideBackCoverId:
        case insideFrontCoverId:
          {
            const singlePageOption = this.layouts.find(
              l => l.value === LAYOUT_TYPES.SINGLE_PAGE.value
            );
            this.layoutSelected = singlePageOption;
          }
          break;
        default:
          {
            const res = this.sheetLayout(pageSelected);
            if (res) {
              this.layoutSelected = res;
            } else {
              const collageOption = this.layouts.find(
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
    setThemeSelected() {},
    onChangeTheme(theme) {
      console.log('theme', theme);
    },
    onChangeLayout(layout) {
      console.log('layout', layout);
    }
  }
};
