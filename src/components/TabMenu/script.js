import { mapGetters } from 'vuex';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';

export default {
  computed: {
    ...mapGetters({
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES
    })
  },
  props: {
    activeTabName: {
      type: String
    }
  },
  data() {
    return {
      tabName: this.activeTabName
    };
  },
  watch: {
    isOpenMenuProperties(val) {
      if (val) return;
      this.tabName = -1;
    }
  },
  methods: {
    /**
     * Emit event change tab with current data to parent
     */
    onChange(data) {
      this.$emit('change', data);
    }
  }
};
