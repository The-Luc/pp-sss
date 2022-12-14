import PpSelect from '@/components/Selectors/Select';
import PpToolPopover from '../ToolPopover';
import Item from './Item';

import { isEmpty } from '@/common/utils';

export default {
  components: {
    PpToolPopover,
    PpSelect,
    Item
  },
  props: {
    optionThemeSelected: {
      type: Object,
      require: true
    },
    themes: {
      type: Array,
      require: true
    },
    selectedThemeId: {
      type: String,
      require: true
    }
  },
  watch: {
    selectedThemeId(id) {
      if (isEmpty(id)) return;

      setTimeout(() => this.getThemeElement(id), 80);
    }
  },
  methods: {
    /**
     * Set selected theme id after click on theme in list of themes
     */
    onSelectTheme(theme) {
      this.$emit('onSelectTheme', theme);
    },
    /**
     * Set selected theme id after change option from select and get theme ref
     */
    onChangeTheme(theme) {
      this.$emit('onChangeTheme', theme);
    },
    /**
     * Trigger mutation set tool name selected is empty to close popover after click Cancel button
     */
    onCancel() {
      this.$emit('onCancel');
    },
    /**
     * Trigger mutation change theme selected id and set tool name selected is empty to close popover after click Change Theme button
     */
    onChangeThemeSelected() {
      this.$emit('onChangeThemeSelected');
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
        block: 'center'
      });
    }
  }
};
