import TabMenu from '@/components/TabMenu';

import { mapGetters } from 'vuex';

import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';

export default {
  components: {
    TabMenu
  },
  computed: {
    ...mapGetters({
      selectedObjectId: APP_GETTERS.TAB_SELECTED_OBJECT_ID
    })
  },
  data() {
    return {
      activeTab: ''
    };
  },
  watch: {
    selectedObjectId(newVal, oldVal) {
      if (newVal !== oldVal) this.activeTab = '';
    }
  },
  methods: {
    /**
     * Emit event change tab with current data to parent
     */
    onChange(data) {
      this.$emit('change', data);
    },
    /**
     * Get the name of tab when use change tab
     *
     * @param {String}  tabName current tab name
     */
    onTabChange(tabName) {
      this.activeTab = tabName;
    }
  }
};
