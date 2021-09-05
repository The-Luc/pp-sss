import ItemTool from './ItemTool';

import {
  TOOL_NAME,
  OBJECT_TYPE,
  PRINT_RIGHT_TOOLS,
  EDITION,
  PRINT_CREATION_TOOLS
} from '@/common/constants';
import { useLayoutPrompt, useToolBar } from '@/hooks';
import { isEmpty, getRightToolItems, isInstructionTool } from '@/common/utils';

export default {
  components: {
    ItemTool
  },
  props: {
    disabledItems: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const { isPrompt } = useLayoutPrompt(EDITION.PRINT);
    const {
      themeId,
      selectedObjectType,
      propertiesType,
      selectedToolName,
      setToolNameSelected,
      togglePropertiesMenu,
      updateMediaSidebarOpen,
      isMediaSidebarOpen,
      setPropertiesType
    } = useToolBar();

    return {
      isPrompt,
      themeId,
      selectedObjectType,
      propertiesType,
      selectedToolName,
      setToolNameSelected,
      togglePropertiesMenu,
      updateMediaSidebarOpen,
      isMediaSidebarOpen,
      setPropertiesType
    };
  },
  data() {
    return {
      itemsToolLeft: PRINT_CREATION_TOOLS,
      itemsToolRight: getRightToolItems(PRINT_RIGHT_TOOLS)
    };
  },
  methods: {
    /**
     * Detect click on item on right creation tool
     * @param  {Object} item Receive item information
     */
    onClickRightTool(item) {
      if (isEmpty(this.themeId)) return;

      if (item.isElementProperties && isEmpty(this.selectedObjectType)) return;

      if (isInstructionTool(this.selectedToolName)) {
        this.$emit('switchTool', '');

        this.setToolNameSelected({ name: '' });
      }

      const toolType = item.name === this.propertiesType ? '' : item.name;

      this.setPropertiesType({ type: toolType });
    },
    /**
     * Detect click on item on left creattion tool
     * @param  {Object} item Receive item information
     */
    onClickLeftTool(item) {
      if (!this.themeId || this.isPrompt) return;

      const name = item?.name;

      const toolName = this.selectedToolName === name ? '' : name;

      if (!item?.isNotDiscard) this.$emit('switchTool', toolName);

      if (item?.isInstruction) {
        const objectType =
          name === TOOL_NAME.IMAGE_BOX ? OBJECT_TYPE.IMAGE : OBJECT_TYPE.TEXT;

        this.$root.$emit('printAddElement', objectType);

        this.setToolNameSelected({ name });

        return;
      }

      const highlightName = item?.isNotHighlight ? '' : toolName;

      this.setToolNameSelected({ name: highlightName });

      if (item?.isNotDiscard) this.$emit('endInstruction');

      if (!item?.isUseCustomAction) return;

      if (name === TOOL_NAME.DELETE) this.$root.$emit('printDeleteElements');

      if (name === TOOL_NAME.UNDO) this.$emit('undo');

      if (name === TOOL_NAME.REDO) this.$emit('redo');

      if (name === TOOL_NAME.PHOTOS) {
        this.updateMediaSidebarOpen({ isOpen: !this.isMediaSidebarOpen });
      }

      if (name === TOOL_NAME.PORTRAIT) {
        this.$emit('toggleModal', { name, isToggle: false });
      }
    }
  }
};
