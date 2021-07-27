import ToolButton from '@/components/Buttons/ToolButton';
import ItemTool from './ItemTool';

import { useLayoutPrompt, useToolBar } from '@/hooks';
import {
  isEmpty,
  getRightToolItems,
  isIntructionTool,
  isElementTool,
  isTogglePropertiesMenu,
  getNonElementToolType
} from '@/common/utils';

import {
  OBJECT_TYPE,
  TOOL_NAME,
  EVENT_TYPE,
  DIGITAL_RIGHT_TOOLS,
  EDITION
} from '@/common/constants';

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
            name: 'Media'
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
            name: 'Delete'
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
  setup() {
    const { isPrompt } = useLayoutPrompt(EDITION.DIGITAL);
    const {
      themeId,
      selectedObjectType,
      propertiesType,
      isMenuOpen,
      selectedToolName,
      setToolNameSelected,
      togglePropertiesMenu
    } = useToolBar(true);

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
        this.$root.$emit(EVENT_TYPE.SWITCH_TOOL, '');
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
      if (
        // !this.printThemeSelectedId || //not yet implemented
        !data?.name ||
        this.selectedToolName === data?.name
      ) {
        this.setToolNameSelected({
          name: ''
        });
        return;
      }

      this.$root.$emit(EVENT_TYPE.SWITCH_TOOL, data.name);

      this.setToolNameSelected({
        name: data.name
      });

      if (data.name === TOOL_NAME.TEXT) {
        this.$root.$emit(EVENT_TYPE.DIGITAL_ADD_ELEMENT, OBJECT_TYPE.TEXT);
      }

      if (data.name === TOOL_NAME.IMAGE_BOX) {
        this.$root.$emit(EVENT_TYPE.DIGITAL_ADD_ELEMENT, OBJECT_TYPE.IMAGE);
      }
    }
  }
};
