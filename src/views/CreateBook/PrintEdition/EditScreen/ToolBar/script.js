import ItemTool from './ItemTool';

import {
  TOOL_NAME,
  OBJECT_TYPE,
  PRINT_RIGHT_TOOLS,
  EDITION,
  PRINT_CREATION_TOOLS,
  SHEET_TYPE
} from '@/common/constants';
import { useLayoutPrompt, useToolBar, useSheet } from '@/hooks';
import {
  isEmpty,
  getRightToolItems,
  isInstructionTool,
  isElementTool,
  isTogglePropertiesMenu,
  getNonElementToolType
} from '@/common/utils';

export default {
  components: {
    ItemTool
  },
  setup() {
    const { isPrompt } = useLayoutPrompt(EDITION.PRINT);
    const {
      themeId,
      selectedObjectType,
      propertiesType,
      isMenuOpen,
      selectedToolName,
      setToolNameSelected,
      togglePropertiesMenu,
      updateMediaSidebarOpen,
      isMediaSidebarOpen,
      disabledToolbarItems
    } = useToolBar();
    const { currentSheet } = useSheet();
    return {
      isPrompt,
      themeId,
      selectedObjectType,
      propertiesType,
      isMenuOpen,
      selectedToolName,
      setToolNameSelected,
      togglePropertiesMenu,
      updateMediaSidebarOpen,
      isMediaSidebarOpen,
      disabledToolbarItems,
      currentSheet
    };
  },
  data() {
    return {
      itemsToolLeft: PRINT_CREATION_TOOLS,
      itemsToolRight: [getRightToolItems(PRINT_RIGHT_TOOLS)]
    };
  },
  computed: {
    disabledItems() {
      return this.currentSheet.type !== SHEET_TYPE.COVER
        ? this.disabledToolbarItems
        : [...this.disabledToolbarItems, TOOL_NAME.PORTRAIT];
    }
  },
  methods: {
    /**
     * Detect click on item on right creation tool
     * @param  {Object} item Receive item information
     */
    onClickRightTool(item) {
      if (isEmpty(this.themeId)) return;

      const isElementProp = isElementTool(item);

      if (isElementProp && isEmpty(this.selectedObjectType)) return;

      if (isInstructionTool(this.selectedToolName)) {
        this.$emit('switchTool', '');

        this.setToolNameSelected({ name: '' });
      }

      const isToggle = isTogglePropertiesMenu(
        item,
        this.propertiesType,
        isElementProp
      );

      const propType = isElementProp
        ? this.selectedObjectType
        : getNonElementToolType(item?.name);

      this.togglePropertiesMenu(propType, isToggle ? !this.isMenuOpen : true);
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
