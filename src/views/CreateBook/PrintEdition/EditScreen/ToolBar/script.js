import ToolButton from '@/components/Buttons/ToolButton';
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
  isIntructionTool,
  isElementTool,
  isTogglePropertiesMenu,
  getNonElementToolType
} from '@/common/utils';

export default {
  props: {
    isDigitalEditor: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ToolButton,
    ItemTool
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
            name: 'Photos'
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
            name: 'Undo'
          },
          {
            iconName: 'redo',
            title: 'Redo',
            name: 'Redo'
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
  setup() {
    const { isPrompt } = useLayoutPrompt(EDITION.PRINT);
    const {
      themeId,
      selectedObjectType,
      propertiesType,
      isMenuOpen,
      selectedToolName,
      setToolNameSelected,
      togglePropertiesMenu
    } = useToolBar();

    return {
      isPrompt,
      themeId,
      selectedObjectType,
      propertiesType,
      isMenuOpen,
      selectedToolName,
      setToolNameSelected,
      togglePropertiesMenu
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

      if (isIntructionTool(this.selectedToolName)) {
        this.$root.$emit('printSwitchTool', '');
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
      if (!this.themeId) return;

      const toolName = this.selectedToolName === data?.name ? '' : data?.name;
      this.$root.$emit('printSwitchTool', toolName);

      switch (data.name) {
        case TOOL_NAME.TEXT:
          this.addElement(OBJECT_TYPE.TEXT);
          this.setToolNameSelected({
            name: TOOL_NAME.TEXT
          });
          break;
        case TOOL_NAME.DELETE:
          this.deleteElements();
          break;
        case TOOL_NAME.IMAGE_BOX:
          this.addElement(OBJECT_TYPE.IMAGE);
          this.setToolNameSelected({
            name: TOOL_NAME.IMAGE_BOX
          });
          break;
        case TOOL_NAME.PRINT_BACKGROUNDS:
          this.setToolNameSelected({
            name: TOOL_NAME.PRINT_BACKGROUNDS
          });
          break;
        case TOOL_NAME.SHAPES:
          this.setToolNameSelected({
            name: TOOL_NAME.SHAPES
          });
          break;
        case TOOL_NAME.ACTIONS:
          this.setToolNameSelected({
            name: toolName
          });
          break;
        default:
          if (data.name === TOOL_NAME.PRINT_LAYOUTS && this.isPrompt) {
            return;
          }
          this.setToolNameSelected({
            name: toolName
          });
          break;
      }
    },
    /**
     * Add element in print canvas
     */
    addElement(objectType) {
      this.$root.$emit('printAddElement', objectType);
    },
    /**
     * Delete selected elements in print canvas
     */
    deleteElements() {
      this.$root.$emit('printDeleteElements');
    }
  }
};
