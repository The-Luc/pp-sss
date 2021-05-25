import { mapGetters } from 'vuex';

import PpToolPopover from '@/components/ToolPopover';
import PpSelect from '@/components/Select';
import { THEMES_LIST } from '@/mock/themesList';
import { GETTERS } from '@/store/modules/theme/const';
import Item from './Item';

export default {
  components: {
    PpToolPopover,
    PpSelect,
    Item
  },
  data() {
    return {
      items: THEMES_LIST,
      selectedThemeId: null,
      optionThemeSelected: {}
    };
  },
  computed: {
    ...mapGetters({
      themes: GETTERS.GET_THEMES
    })
  },
  methods: {
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
      const el = this.$refs[`theme${theme.id}`][0].$el;
      if (el) {
        this.scrollToElement(el);
      }
    },
    /**
     * Scroll to theme postion which choose from select
     */
    scrollToElement(el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
};
