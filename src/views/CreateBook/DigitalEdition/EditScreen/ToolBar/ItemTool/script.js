import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import ToolButton from '@/components/Buttons/ToolButton';
import { useLayoutPrompt } from '@/hooks';
import { DIGITAL_RIGHT_TOOLS, OBJECT_TYPE, EDITION } from '@/common/constants';
import { isEmpty } from '@/common/utils';

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

        return this.isActivatedMenuProperties(iconName)
          ? this.isOpenMenuProperties
          : iconName === this.selectedToolName;
      };
    }
  },
  methods: {
    /**
     * Check if background properties is activated
     *
     * @param   {String}  iconName  name of clicked icon
     * @returns {Boolean}           background properties is activated or not
     */
    isBackgroundActive(iconName) {
      const isBackgroundSelected =
        this.propertiesObjectType === OBJECT_TYPE.BACKGROUND;

      const isBackgroundMenu =
        DIGITAL_RIGHT_TOOLS.BACKGROUND.value === iconName;

      return isBackgroundSelected && isBackgroundMenu;
    },
    /**
     * Check if menu properties is activated
     *
     * @param   {String}  iconName  name of clicked icon
     * @returns {Boolean}           menu properties is activated or not
     */
    isActivatedMenuProperties(iconName) {
      const isFrameInfoSelected =
        this.propertiesObjectType === DIGITAL_RIGHT_TOOLS.FRAME_INFO.value;
      const isFrameInfoMenu = DIGITAL_RIGHT_TOOLS.FRAME_INFO.value === iconName;
      const isFrameInfoActive = isFrameInfoSelected && isFrameInfoMenu;

      return isFrameInfoActive || this.isBackgroundActive(iconName);
    },
    /**
     * Emit event click when click on icon
     * @param  {object} item Icon's object selected
     */
    onClick(item) {
      this.$emit('click', item);
    }
  }
};
