import PpToolPopover from '@/components/ToolPopover';
import PpSelect from '@/components/Selectors/Select';
import Item from './Item';

export default {
  components: {
    PpToolPopover,
    PpSelect,
    Item
  },
  props: {
    items: {
      type: Array,
      require: true
    },
    optionThemeSelected: {
      type: Object,
      require: true
    },
    themes: {
      type: Array,
      require: true
    },
    selectedThemeId: {
      type: Number,
      require: true
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
    }
  }
};
