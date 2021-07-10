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

        const isBackgroundSelected =
          this.propertiesObjectType === OBJECT_TYPE.BACKGROUND;

        const isBackgroundMenu =
          DIGITAL_RIGHT_TOOLS.BACKGROUND.value === iconName;

        const isBackgroundActive = isBackgroundSelected && isBackgroundMenu;

        const isPageInfoSelected =
          this.propertiesObjectType === DIGITAL_RIGHT_TOOLS.PAGE_INFO.value;
        const isPageInfoMenu = DIGITAL_RIGHT_TOOLS.PAGE_INFO.value === iconName;
        const isPageInfoActive = isPageInfoSelected && isPageInfoMenu;

        const isPropertiesSelected =
          !isEmpty(this.propertiesObjectType) &&
          !isBackgroundSelected &&
          !isPageInfoSelected;

        const isPropertiesMenu =
          DIGITAL_RIGHT_TOOLS.PROPERTIES.value === iconName;

        const isPropertiesActive = isPropertiesSelected && isPropertiesMenu;

        if (isBackgroundActive || isPropertiesActive || isPageInfoActive) {
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
