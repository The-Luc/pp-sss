import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import { TOOL_NAME } from '@/common/constants';

import PrintThemes from './Themes';
import Layouts from './Layouts';
import Backgrounds from './Backgrounds';
import Shapes from './Shapes';
import ClipArt from './ClipArt';
import Actions from './Actions';
import DigitalThemes from './DigitalThemes';

const {
  PRINT_THEMES,
  DIGITAL_THEMES,
  LAYOUTS,
  BACKGROUNDS,
  CLIP_ART,
  SHAPES,
  ACTIONS
} = TOOL_NAME;

const ToolList = {
  [PRINT_THEMES]: PRINT_THEMES,
  [DIGITAL_THEMES]: DIGITAL_THEMES,
  [LAYOUTS]: LAYOUTS,
  [BACKGROUNDS]: BACKGROUNDS,
  [CLIP_ART]: CLIP_ART,
  [SHAPES]: SHAPES,
  [ACTIONS]: ACTIONS
};

export default {
  data() {
    return {
      toolComponent: '',
      componentKey: true
    };
  },
  components: {
    [TOOL_NAME.PRINT_THEMES]: PrintThemes,
    [TOOL_NAME.DIGITAL_THEMES]: DigitalThemes,
    [TOOL_NAME.LAYOUTS]: Layouts,
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
