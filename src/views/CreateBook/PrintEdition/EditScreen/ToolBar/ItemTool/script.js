import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import ToolButton from '@/components/ToolButton';
import { useLayoutPrompt } from '@/hooks';

export default {
  setup() {
    const { isPrompt } = useLayoutPrompt();
    return { isPrompt };
  },
  components: {
    ToolButton
  },
  props: {
    items: Array
  },
  computed: {
    ...mapGetters({
      selectedToolName: GETTERS.SELECTED_TOOL_NAME,
      selectedObjectType: GETTERS.SELECTED_OBJECT_TYPE,
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES
    }),
    /**
     * Check whether icon tool active or not
     * @param  {String} iconName The name of icon be clicked
     * @return {Boolean}  Active current icon clicked and inactive icon before
     */
    isActive() {
      return iconName => {
        if (!iconName) {
          return false;
        }
        if (iconName === 'properties') {
          return this.isOpenMenuProperties;
        }

        return iconName === this.selectedToolName;
      };
    }
  },
  methods: {
    /**
     * Emit event click when click on icon
     * @param  {object} item Icon's object selected
     */
    onClick(item) {
      this.$emit('click', item);
    }
  }
};
