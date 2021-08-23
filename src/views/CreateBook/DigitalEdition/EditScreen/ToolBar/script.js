import ItemTool from './ItemTool';

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

import {
  OBJECT_TYPE,
  TOOL_NAME,
  EVENT_TYPE,
  DIGITAL_RIGHT_TOOLS,
  EDITION
} from '@/common/constants';

export default {
  components: {
    ItemTool
  },
  setup() {
    const { isPrompt } = useLayoutPrompt(EDITION.DIGITAL);
    const {
      themeId,
      selectedObjectType,
      propertiesType,
      isMenuOpen,
      selectedToolName,
      setToolNameSelected,
      togglePropertiesMenu,
      updateMediaSidebarOpen
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
      updateMediaSidebarOpen
    };
  },
  data() {
    return {
      itemsToolLeft: [
        [
          {
            iconName: 'photo_filter',
            title: 'Themes',
            name: TOOL_NAME.DIGITAL_THEMES
          },
          {
            iconName: 'import_contacts',
            title: 'Layouts',
            name: TOOL_NAME.DIGITAL_LAYOUTS
          },
          {
            iconName: 'texture',
            title: 'Backgrounds',
            name: TOOL_NAME.DIGITAL_BACKGROUNDS
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
            title: 'Media',
            name: TOOL_NAME.MEDIA
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
            name: 'Actions'
          },
          {
            iconName: 'post_add',
            title: 'Screen Notes',
            name: 'ScreenNotes'
          }
        ]
      ],
      itemsToolRight: [
        [
          {
            iconName: 'play_circle_outline',
            title: 'Playback',
            name: 'playback'
          },
          {
            iconName: 'auto_awesome_motion',
            title: 'Transitions',
            name: 'transitions'
          },
          {
            iconName: 'animation',
            title: 'Animations',
            name: 'animations'
          }
        ],
        getRightToolItems(DIGITAL_RIGHT_TOOLS)
      ]
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

        this.$root.$emit(EVENT_TYPE.DIGITAL_ADD_ELEMENT, objectType);

        this.setToolNameSelected({ name });

        return;
      }

      if (!isOneClickTool(name)) {
        this.setToolNameSelected({ name: toolName });

        return;
      }

      this.setToolNameSelected({ name: '' });

      this.$emit('endInstruction');

      if (name === TOOL_NAME.DELETE) {
        this.$root.$emit(EVENT_TYPE.DELETE_OBJECTS);
      }

      if (name === TOOL_NAME.UNDO) this.$emit('undo');

      if (name === TOOL_NAME.REDO) this.$emit('redo');

      if (name === TOOL_NAME.MEDIA) {
        this.updateMediaSidebarOpen({ isOpen: true });
      }
    }
  }
};
