import ItemTool from './ItemTool';

import {
  TOOL_NAME,
  OBJECT_TYPE,
  PRINT_RIGHT_TOOLS,
  EDITION
} from '@/common/constants';
import { useLayoutPrompt, useToolBar } from '@/hooks';
import {
  isEmpty,
  getRightToolItems,
  isInstructionTool,
  isElementTool,
  isTogglePropertiesMenu,
  getNonElementToolType,
  isOneClickTool
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
      isMediaSidebarOpen
    } = useToolBar();

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
      isMediaSidebarOpen
    };
  },
  data() {
    return {
      itemsToolLeft: [
        [
          {
            iconName: 'photo_filter',
            title: 'Themes',
            name: TOOL_NAME.PRINT_THEMES
          },
          {
            iconName: 'import_contacts',
            title: 'Layouts',
            name: TOOL_NAME.PRINT_LAYOUTS
          },
          {
            iconName: 'texture',
            title: 'Backgrounds',
            name: TOOL_NAME.PRINT_BACKGROUNDS
          },
          {
            iconName: 'local_florist',
            title: 'Clip Art',
            name: TOOL_NAME.CLIP_ART
          }
        ],
        [
          {
            iconName: 'star',
            title: 'Shapes',
            name: TOOL_NAME.SHAPES
          },
          {
            iconName: 'text_format',
            title: 'Text',
            name: TOOL_NAME.TEXT
          },
          {
            iconName: 'photo_size_select_large',
            title: 'Image Box',
            name: TOOL_NAME.IMAGE_BOX
          },
          {
            iconName: 'collections',
            title: 'Photos',
            name: TOOL_NAME.PHOTOS
          },
          {
            iconName: 'portrait',
            title: 'Portraits',
            name: 'Portraits'
          }
        ],
        [
          {
            iconName: 'grid_on',
            title: 'Grid',
            name: 'Grid'
          },
          {
            iconName: 'undo',
            title: 'Undo',
            name: TOOL_NAME.UNDO
          },
          {
            iconName: 'redo',
            title: 'Redo',
            name: TOOL_NAME.REDO
          },
          {
            iconName: 'delete',
            title: 'Delete',
            name: TOOL_NAME.DELETE
          }
        ],
        [
          {
            iconName: 'smart_button',
            title: 'Actions',
            name: TOOL_NAME.ACTIONS
          },
          {
            iconName: 'note_add',
            title: 'Page Notes',
            name: 'PageNotes'
          }
        ]
      ],
      itemsToolRight: [getRightToolItems(PRINT_RIGHT_TOOLS)]
    };
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
    onClickLeftTool(data) {
      if (!this.themeId || this.isPrompt) return;

      const name = data?.name;

      const toolName = this.selectedToolName === name ? '' : name;

      if (!isOneClickTool(name)) this.$emit('switchTool', toolName);

      if (isInstructionTool(name)) {
        const objectType =
          name === TOOL_NAME.IMAGE_BOX ? OBJECT_TYPE.IMAGE : OBJECT_TYPE.TEXT;

        this.$root.$emit('printAddElement', objectType);

        this.setToolNameSelected({ name });

        return;
      }

      if (!isOneClickTool(name)) {
        this.setToolNameSelected({ name: toolName });

        return;
      }

      this.setToolNameSelected({ name: '' });

      this.$emit('endInstruction');

      if (name === TOOL_NAME.DELETE) this.$root.$emit('printDeleteElements');

      if (name === TOOL_NAME.UNDO) this.$emit('undo');

      if (name === TOOL_NAME.REDO) this.$emit('redo');

      if (name === TOOL_NAME.PHOTOS) {
        this.updateMediaSidebarOpen({ isOpen: !this.isMediaSidebarOpen });
      }
    }
  }
};
