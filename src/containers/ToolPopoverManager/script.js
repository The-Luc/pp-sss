import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import { EDITION, TOOL_NAME, NO_SUBMENU_TOOLS } from '@/common/constants';

import PrintThemes from './Themes/PrintThemes';
import DigitalThemes from './Themes/DigitalThemes';
import PrintLayouts from './Layouts/PrintLayouts';
import DigitalLayouts from './Layouts/DigitalLayouts';
import PrintBackgrounds from './Backgrounds/PrintBackgrounds';
import DigitalBackgrounds from './Backgrounds/DigitalBackgrounds';
import Shapes from './Shapes';
import ClipArts from './ClipArts';
import Actions from './Actions';

const {
  PRINT_THEMES,
  DIGITAL_THEMES,
  PRINT_LAYOUTS,
  DIGITAL_LAYOUTS,
  PRINT_BACKGROUNDS,
  DIGITAL_BACKGROUNDS,
  CLIP_ART,
  SHAPES,
  ACTIONS
} = TOOL_NAME;

const ToolList = {
  [PRINT_THEMES]: PRINT_THEMES,
  [DIGITAL_THEMES]: DIGITAL_THEMES,
  [PRINT_LAYOUTS]: PRINT_LAYOUTS,
  [DIGITAL_LAYOUTS]: DIGITAL_LAYOUTS,
  [PRINT_BACKGROUNDS]: PRINT_BACKGROUNDS,
  [DIGITAL_BACKGROUNDS]: DIGITAL_BACKGROUNDS,
  [CLIP_ART]: CLIP_ART,
  [SHAPES]: SHAPES,
  [ACTIONS]: ACTIONS
};

export default {
  data() {
    return {
      toolComponent: '',
      componentKey: 0,
      edition: ''
    };
  },
  components: {
    [TOOL_NAME.PRINT_THEMES]: PrintThemes,
    [TOOL_NAME.DIGITAL_THEMES]: DigitalThemes,
    [TOOL_NAME.PRINT_LAYOUTS]: PrintLayouts,
    [TOOL_NAME.DIGITAL_LAYOUTS]: DigitalLayouts,
    [TOOL_NAME.PRINT_BACKGROUNDS]: PrintBackgrounds,
    [TOOL_NAME.DIGITAL_BACKGROUNDS]: DigitalBackgrounds,
    [TOOL_NAME.CLIP_ART]: ClipArts,
    [TOOL_NAME.SHAPES]: Shapes,
    [TOOL_NAME.ACTIONS]: Actions
  },
  props: {
    isDigital: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      selectedToolName: GETTERS.SELECTED_TOOL_NAME
    })
  },
  watch: {
    selectedToolName(toolName) {
      if (NO_SUBMENU_TOOLS.includes(toolName)) {
        this.toolComponent = null;
        return;
      }

      if (toolName === TOOL_NAME.PRINT_LAYOUTS) this.edition = EDITION.PRINT;
      else if (toolName === TOOL_NAME.DIGITAL_LAYOUTS)
        this.edition = EDITION.DIGITAL;

      const isBackgroundMenu =
        toolName === TOOL_NAME.PRINT_BACKGROUNDS ||
        toolName === TOOL_NAME.DIGITAL_BACKGROUNDS;
      const isCLipArtMenu = toolName === TOOL_NAME.CLIP_ART;
      const isShapeMenu = toolName === TOOL_NAME.SHAPES;

      this.componentKey =
        isBackgroundMenu || isCLipArtMenu || isShapeMenu
          ? this.componentKey++
          : '';

      if (toolName) {
        this.setToolComponent(toolName);
      } else {
        this.toolComponent = '';
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
