import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import { EDITION, TOOL_NAME } from '@/common/constants';

import Themes from './Themes';
import Layouts from './Layouts';
import Backgrounds from './Backgrounds';
import Shapes from './Shapes';
import ClipArt from './ClipArt';
import Actions from './Actions';

const {
  THEMES,
  PRINT_LAYOUTS,
  DIGITAL_LAYOUTS,
  BACKGROUNDS,
  CLIP_ART,
  SHAPES,
  ACTIONS
} = TOOL_NAME;

const ToolList = {
  [THEMES]: THEMES,
  [PRINT_LAYOUTS]: PRINT_LAYOUTS,
  [DIGITAL_LAYOUTS]: DIGITAL_LAYOUTS,
  [BACKGROUNDS]: BACKGROUNDS,
  [CLIP_ART]: CLIP_ART,
  [SHAPES]: SHAPES,
  [ACTIONS]: ACTIONS
};

export default {
  data() {
    return {
      toolComponent: '',
      componentKey: true,
      edition: EDITION.PRINT
    };
  },
  components: {
    [TOOL_NAME.THEMES]: Themes,
    [TOOL_NAME.PRINT_LAYOUTS]: Layouts,
    [TOOL_NAME.DIGITAL_LAYOUTS]: Layouts,
    [TOOL_NAME.BACKGROUNDS]: Backgrounds,
    [TOOL_NAME.CLIP_ART]: ClipArt,
    [TOOL_NAME.SHAPES]: Shapes,
    [TOOL_NAME.ACTIONS]: Actions
  },
  computed: {
    ...mapGetters({
      selectedToolName: GETTERS.SELECTED_TOOL_NAME
    })
  },
  watch: {
    selectedToolName(toolName) {
      if ([TOOL_NAME.IMAGE_BOX, TOOL_NAME.TEXT].includes(toolName)) {
        this.toolComponent = null;
        return;
      }

      this.edition =
        toolName === TOOL_NAME.PRINT_LAYOUTS ? EDITION.PRINT : EDITION.DIGITAL;

      this.componentKey =
        toolName === TOOL_NAME.BACKGROUNDS ? !this.componentKey : '';

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
