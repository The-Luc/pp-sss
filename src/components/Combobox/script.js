import { ICON_LOCAL } from '@/common/constants';

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
     * Close menu when click out combobox
     */
    onClickOutCombobox() {
      this.isOpenMenu = false;
    }
  }
};
