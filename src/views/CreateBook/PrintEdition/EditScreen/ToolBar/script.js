import { mapMutations, mapGetters } from 'vuex';
import ToolButton from '@/components/Buttons/ToolButton';
import ItemTool from './ItemTool';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import {
  TOOL_NAME,
  OBJECT_TYPE,
  RIGHT_TOOLS,
  EDITION
} from '@/common/constants';
import { useLayoutPrompt } from '@/hooks';
import { isEmpty } from '@/common/utils';

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
    const rightTools = Object.keys(RIGHT_TOOLS).map(k => {
      return {
        iconName: RIGHT_TOOLS[k].iconName,
        title: RIGHT_TOOLS[k].name,
        name: RIGHT_TOOLS[k].value
      };
    });

    return {
      itemsToolLeft: [
        [
          {
            iconName: 'photo_filter',
            title: 'Themes',
            name: TOOL_NAME.THEMES
          },
          {
            iconName: 'import_contacts',
            title: 'Layouts',
            name: TOOL_NAME.PRINT_LAYOUTS
          },
          {
            iconName: 'texture',
            title: TOOL_NAME.BACKGROUNDS,
            name: TOOL_NAME.BACKGROUNDS
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
            title: 'Photos'
          },
          {
            iconName: 'portrait',
            title: 'Portraits'
          }
        ],
        [
          {
            iconName: 'grid_on',
            title: 'Grid'
          },
          {
            iconName: 'undo',
            title: 'Undo'
          },
          {
            iconName: 'redo',
            title: 'Redo'
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
            title: 'Page Notes'
          }
        ]
      ],
      itemsToolRight: [rightTools]
    };
  },
  computed: {
    ...mapGetters({
      selectedObjectType: GETTERS.SELECTED_OBJECT_TYPE,
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: GETTERS.SELECTED_TOOL_NAME,
      printThemeSelectedId: BOOK_GETTERS.PRINT_THEME_SELECTED_ID,
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

      if (item.name === RIGHT_TOOLS.PROPERTIES.value) {
        this.elementPropertiesClick();

        return;
      }

      if (item.name === RIGHT_TOOLS.BACKGROUND.value) {
        this.backgroundPropertiesClick();

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
        case TOOL_NAME.BACKGROUNDS:
          this.setToolNameSelected({
            name: TOOL_NAME.BACKGROUNDS
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

      const isToggle = this.propertiesObjectType !== OBJECT_TYPE.BACKGROUND;

      isToggle ? this.toggleElementProperties() : this.openElementProperties();
    },
    /**
     * Toggle Element Properties by using mutate
     */
    toggleElementProperties() {
      this.setPropertiesObjectType({
        type: this.selectedObjectType
      });

      this.setIsOpenProperties({
        isOpen: !this.isOpenMenuProperties
      });
    },
    /**
     * Open Element Properties by using mutate
     */
    openElementProperties() {
      this.setPropertiesObjectType({
        type: this.selectedObjectType
      });

      this.setIsOpenProperties({
        isOpen: true
      });
    },
    /**
     * Fire when click on Background button
     */
    backgroundPropertiesClick() {
      const isToggle =
        isEmpty(this.selectedObjectType) ||
        this.propertiesObjectType === OBJECT_TYPE.BACKGROUND;

      isToggle
        ? this.toggleBackgroundProperties()
        : this.openBackgroundProperties();
    },
    /**
     * Toggle Background Properties by using mutate
     */
    toggleBackgroundProperties() {
      this.setPropertiesObjectType({
        type: OBJECT_TYPE.BACKGROUND
      });

      this.setIsOpenProperties({
        isOpen: !this.isOpenMenuProperties
      });
    },
    /**
     * Open Background Properties by using mutate
     */
    openBackgroundProperties() {
      this.setPropertiesObjectType({
        type: OBJECT_TYPE.BACKGROUND
      });

      this.setIsOpenProperties({
        isOpen: true
      });
    }
  }
};
