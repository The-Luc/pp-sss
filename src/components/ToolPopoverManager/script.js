import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import { TOOL_NAME } from '@/common/constants';

import Themes from './Themes';
import Layouts from './Layouts';

const { THEMES, LAYOUTS } = TOOL_NAME;

const ToolList = {
  [THEMES]: THEMES,
  [LAYOUTS]: LAYOUTS
};

export default {
  data() {
    return {
      toolComponent: ''
    };
  },
  components: {
    [TOOL_NAME.THEMES]: Themes,
    [TOOL_NAME.LAYOUTS]: Layouts
  },
  computed: {
    ...mapGetters({
      selectedToolName: GETTERS.SELECTED_TOOL_NAME
    })
  },
  watch: {
    selectedToolName(toolName) {
      if (toolName) {
        this.setToolComponent(toolName);
      }
    }
  },
  methods: {
    /**
     * Set tool's content component base on selected tool name from store
     * @param  {String} toolName Tool's name when user click on tool icon.
     */
    setToolComponent(toolName) {
      const ToolContentComponent = ToolList[toolName];
      if (ToolContentComponent) {
        this.toolComponent = ToolContentComponent;
      }
    }
  }
};
