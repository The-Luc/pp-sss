import { mapGetters } from 'vuex';

import { GETTERS } from '@/store/modules/app/const';
import { EDITION, TOOL_NAME } from '@/common/constants';

import PrintThemes from './PrintThemes';
import Layouts from './PrintEdition/Layouts';
import PrintBackgrounds from './PrintEdition/Backgrounds';
import DigitalBackgrounds from './DigitalEdition/Backgrounds';
import Shapes from './Shapes';
import ClipArt from './ClipArt';
import Actions from './Actions';
import DigitalThemes from './DigitalThemes';

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
      componentKey: true,
      edition: ''
    };
  },
  components: {
    [TOOL_NAME.PRINT_THEMES]: PrintThemes,
    [TOOL_NAME.DIGITAL_THEMES]: DigitalThemes,
    [TOOL_NAME.PRINT_LAYOUTS]: Layouts,
    [TOOL_NAME.DIGITAL_LAYOUTS]: Layouts,
    [TOOL_NAME.PRINT_BACKGROUNDS]: PrintBackgrounds,
    [TOOL_NAME.DIGITAL_BACKGROUNDS]: DigitalBackgrounds,
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

      if (toolName === TOOL_NAME.PRINT_LAYOUTS) this.edition = EDITION.PRINT;
      else if (toolName === TOOL_NAME.DIGITAL_LAYOUTS)
        this.edition = EDITION.DIGITAL;

      const isBackgroundMenu =
        toolName === TOOL_NAME.PRINT_BACKGROUNDS ||
        toolName === TOOL_NAME.DIGITAL_BACKGROUNDS;

      this.componentKey = isBackgroundMenu ? !this.componentKey : '';

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
