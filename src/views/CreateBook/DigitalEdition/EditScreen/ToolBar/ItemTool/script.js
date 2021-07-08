import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import ToolButton from '@/components/Buttons/ToolButton';
import { useLayoutPrompt } from '@/hooks';
import { DIGI_RIGHT_TOOLS, EDITION } from '@/common/constants';

export default {
  setup() {
    const { isPrompt } = useLayoutPrompt(EDITION.DIGITAL);
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
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES,
      propertiesObjectType: GETTERS.PROPERTIES_OBJECT_TYPE
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

        const isFrameInfoSelected =
          this.propertiesObjectType === DIGI_RIGHT_TOOLS.FRAME_INFO.value;
        const isFrameInfoMenu = DIGI_RIGHT_TOOLS.FRAME_INFO.value === iconName;
        const isFrameInfoActive = isFrameInfoSelected && isFrameInfoMenu;

        if (isFrameInfoActive) {
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
