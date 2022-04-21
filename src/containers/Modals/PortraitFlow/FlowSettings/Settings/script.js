import TabHeader from './TabHeader';

export default {
  components: {
    TabHeader
  },
  props: {
    currentTab: {
      type: Number,
      default: 0
    },
    savedSettings: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    /**
     * Emit accept event to parent
     */
    onSaveSettings() {
      this.$emit('saveSetting');
    },
    /**
     * Emit event change tab with current data to parent
     *
     * @param {Number}  tabIndex  index of selected tab
     */
    onTabChange(tabIndex) {
      this.$emit('settingTabChange', { tabIndex });
    }
  }
};
