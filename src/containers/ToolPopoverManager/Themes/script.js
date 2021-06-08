import { mapGetters, mapMutations } from 'vuex';

import PpToolPopover from '@/components/ToolPopover';
import PpSelect from '@/components/Select';
import { themeOptions } from '@/mock/themes';
import { GETTERS as THEME_GETTERS } from '@/store/modules/theme/const';
import {
  GETTERS as BOOK_GETTER,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';
import {
  GETTERS as APP_GETTERS,
  MUTATES as APP_MUTATES
} from '@/store/modules/app/const';
import Item from './Item';
import { TOOL_NAME } from '@/common/constants';

export default {
  components: {
    PpToolPopover,
    PpSelect,
    Item
  },
  data() {
    return {
      items: themeOptions,
      selectedThemeId: null,
      optionThemeSelected: {}
    };
  },
  computed: {
    ...mapGetters({
      themes: THEME_GETTERS.GET_THEMES,
      printThemeSelectedId: BOOK_GETTER.PRINT_THEME_SELECTED_ID,
      selectedToolName: APP_GETTERS.SELECTED_TOOL_NAME
    })
  },
  watch: {
    selectedToolName(toolName) {
      if (!toolName) {
        this.selectedThemeId = null;
        this.optionThemeSelected = {};
      }
      if (this.printThemeSelectedId && toolName === TOOL_NAME.THEMES) {
        this.initData();
      }
    }
  },
  mounted() {
    if (this.printThemeSelectedId) {
      this.initData();
    }
  },
  methods: {
    ...mapMutations({
      triggerThemeIdSelected: BOOK_MUTATES.SELECT_THEME,
      setToolNameSelected: APP_MUTATES.SET_TOOL_NAME_SELECTED
    }),
    /**
     * Set up needly data to render to view: selectedThemeId, optionThemeSelected
     */
    initData() {
      this.selectedThemeId = this.printThemeSelectedId;
      this.setOptionThemeSelected(this.printThemeSelectedId);
      this.getThemeElement(this.printThemeSelectedId);
    },
    /**
     * Set selected theme id after click on theme in list of themes
     */
    onSelectTheme(theme) {
      this.selectedThemeId = theme.id;
      this.setOptionThemeSelected(theme.id);
    },
    /**
     * Set value for select base on theme selected
     */
    setOptionThemeSelected(themeId) {
      const optionThemeSelected =
        this.items.find(item => item.id === themeId) || {};
      this.optionThemeSelected = optionThemeSelected;
    },
    /**
     * Set selected theme id after change option from select and get theme ref
     */
    onChangeTheme(theme) {
      this.selectedThemeId = theme.id;
      this.getThemeElement(theme.id);
    },
    /**
     * Get theme element by theme id
     */
    getThemeElement(themeId) {
      const el = this.$refs[`theme${themeId}`][0].$el;
      if (el) {
        this.scrollToElement(el);
      }
    },
    /**
     * Scroll to theme position which choose from select
     */
    scrollToElement(el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    },
    /**
     * Trigger mutation set tool name selected is empty to close popover after click Cancel button
     */
    onCancel() {
      this.setToolNameSelected({
        name: ''
      });
    },
    /**
     * Trigger mutation change theme selected id and set tool name selected is empty to close popover after click Change Theme button
     */
    onChangeThemeSelected() {
      this.triggerThemeIdSelected({
        themeId: this.selectedThemeId
      });
      this.setToolNameSelected({
        name: ''
      });
    }
  }
};
