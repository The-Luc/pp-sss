import { mapMutations, mapGetters } from 'vuex';
import ToolButton from '@/components/Buttons/ToolButton';
import ItemTool from './ItemTool';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import {
  TOOL_NAME,
  OBJECT_TYPE,
  PRINT_RIGHT_TOOLS,
  EDITION
} from '@/common/constants';
import { useLayoutPrompt } from '@/hooks';
import { isEmpty, getRightToolItems } from '@/common/utils';

export default {
  setup() {
    const { isPrompt } = useLayoutPrompt(EDITION.PRINT);
    return {
      isPrompt
    };
  },
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
            title: TOOL_NAME.SHAPES,
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
  computed: {
    ...mapGetters({
      selectedObjectType: GETTERS.SELECTED_OBJECT_TYPE,
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: GETTERS.SELECTED_TOOL_NAME,
      printThemeSelectedId: PRINT_GETTERS.DEFAULT_THEME_ID,
      currentBackgrounds: PRINT_GETTERS.BACKGROUNDS,
      propertiesObjectType: GETTERS.PROPERTIES_OBJECT_TYPE
    })
  },
  methods: {
    ...mapMutations({
      setObjectTypeSelected: MUTATES.SET_OBJECT_TYPE_SELECTED,
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
      setToolNameSelected: MUTATES.SET_TOOL_NAME_SELECTED,
      setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE
    }),
    /**
     * Detect click on item on right creation tool
     * @param  {Object} item Receive item information
     */
    onClickRightTool(item) {
      if (!this.printThemeSelectedId) {
        return;
      }

      const toolName = this.selectedToolName === item?.name ? '' : item?.name;
      this.$root.$emit('printSwitchTool', toolName);

      if (item.name === PRINT_RIGHT_TOOLS.PROPERTIES.value) {
        this.elementPropertiesClick();

        return;
      }

      if (item.name === PRINT_RIGHT_TOOLS.BACKGROUND.value) {
        this.noneElementPropertiesClick(OBJECT_TYPE.BACKGROUND);

        return;
      }

      if (item.name === PRINT_RIGHT_TOOLS.PAGE_INFO.value) {
        this.noneElementPropertiesClick(PRINT_RIGHT_TOOLS.PAGE_INFO.value);

        return;
      }
    },
    /**
     * Detect click on item on left creattion tool
     * @param  {Object} item Receive item information
     */
    onClickLeftTool(data) {
      if (!this.printThemeSelectedId) {
        return;
      }

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
    },
    /**
     * Fire when click on Properties button
     */
    elementPropertiesClick() {
      if (!this.selectedObjectType) {
        return;
      }

      const notElementProperties = [
        OBJECT_TYPE.BACKGROUND,
        PRINT_RIGHT_TOOLS.PAGE_INFO.value
      ];

      const isToggle = !notElementProperties.includes(
        this.propertiesObjectType
      );

      isToggle
        ? this.toggleObjectProperties(this.selectedObjectType)
        : this.openObjectProperties(this.selectedObjectType);
    },
    /**
     * Fire when click on Page Info button or Background Properties button
     */
    noneElementPropertiesClick(objectType) {
      const isToggle =
        isEmpty(this.propertiesObjectType) ||
        this.propertiesObjectType === objectType;

      isToggle
        ? this.toggleObjectProperties(objectType)
        : this.openObjectProperties(objectType);
    },
    /**
     * Toggle object properties by using mutate
     */
    toggleObjectProperties(objectType) {
      this.setPropertiesObjectType({
        type: objectType
      });

      this.setIsOpenProperties({
        isOpen: !this.isOpenMenuProperties
      });
    },
    /**
     * Open object properties by using mutate
     */
    openObjectProperties(objectType) {
      this.setPropertiesObjectType({
        type: objectType
      });

      this.setIsOpenProperties({
        isOpen: true
      });
    }
  }
};
