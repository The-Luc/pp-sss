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
import { TOOL_NAME } from '@/common/constants';

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
      selectedToolName: APP_GETTERS.SELECTED_TOOL_NAME
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
      layoutSelected: {},
      themeSelected: {}
    };
  },
  mounted() {
    console.log('book', this.book);
    console.log('pageSelected', this.pageSelected);
    this.initData();
  },
  methods: {
    initData() {
      console.log('initData');
    },
    /**
     * [someFunction description]
     */
    setLayoutSelected() {
      // Check exist sheet's layout
      // yes: layoutSelected = sheet's layout
      // no:
      // isCover, isSinglePage
    },
    setDisabledLayout() {
      // disable: isCover || isSinglePage
    },
    setThemeSelected() {
      //
    },
    onChangeTheme(theme) {
      console.log('theme', theme);
    },
    onChangeLayout(layout) {
      console.log('layout', layout);
    }
  }
};
