import { ICON_LOCAL } from '@/common/constants';
import { unFocus } from '@/common/utils';

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    prependedIcon: {
      type: String,
      default: ''
    },
    appendedIcon: {
      type: String,
      default: ICON_LOCAL.ARROW_SELECT
    },
    activeMenuIcon: {
      type: String,
      default: ICON_LOCAL.ACTIVE_MENU
    },
    selectedVal: {
      type: Object,
      default: () => ({ name: '', value: '' })
    },
    nudgeWidth: {
      type: Number,
      default: 73
    }
  },
  data() {
    return {
      isOpenMenu: false,
      menuX: 0,
      menuY: 0
    };
  },
  methods: {
    /**
     * Set menu's position base on element clicked and set data to open menu
     */
    onOpenMenu() {
      const { x, y } = this.$refs.ppCombobox.$el.getBoundingClientRect();
      this.menuX = x;
      this.menuY = y;
      this.isOpenMenu = true;
    },
    /**
     * Close menu and emit value selected to parent
     */
    onChange(val) {
      this.isOpenMenu = false;
      this.$emit('change', val);
    },
    /**
     * Trigger change value when user press enter
     * @param {KeyboardEvent} e - keypress event object
     */
    onEnter(e) {
      this.onChange(e.target.value);
    },
    /**
     * Revert to previous data and Un focus input element
     */
    onEsc() {
      this.onChange(this.selectedVal);
      unFocus();
    },
    /**
     * Close menu when click out combobox
     */
    onClickOutCombobox() {
      this.isOpenMenu = false;
    }
  }
};
