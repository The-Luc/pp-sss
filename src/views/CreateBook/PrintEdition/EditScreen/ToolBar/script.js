import { mapMutations, mapGetters } from 'vuex';
import ToolButton from '@/components/ToolButton';
import ItemTool from './ItemTool';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import { OBJECT_TYPE, TOOL_NAME } from '@/common/constants';
import { useLayoutPrompt } from '@/hooks';

export default {
  setup() {
    const { isPrompt } = useLayoutPrompt();
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
            name: TOOL_NAME.THEMES
          },
          {
            iconName: 'import_contacts',
            title: 'Layouts',
            name: TOOL_NAME.LAYOUTS
          },
          {
            iconName: 'texture',
            title: 'Backgrounds',
            name: 'backgrounds'
          },
          {
            iconName: 'local_florist',
            title: 'Clip Art',
            name: 'clipArt'
          }
        ],
        [
          {
            iconName: 'star',
            title: 'Shapes',
            name: 'shapes'
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
            title: 'Actions'
          },
          {
            iconName: 'note_add',
            title: 'Page Notes'
          }
        ]
      ],
      itemsToolRight: [
        [
          {
            iconName: 'list_alt',
            title: 'Page Info',
            name: 'pageInfo'
          },
          {
            iconName: 'wysiwyg',
            title: 'Properties',
            name: 'properties'
          }
        ]
      ]
    };
  },
  mounted() {},
  computed: {
    ...mapGetters({
      selectedObjectType: GETTERS.SELECTED_OBJECT_TYPE,
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: GETTERS.SELECTED_TOOL_NAME,
      printThemeSelectedId: BOOK_GETTERS.PRINT_THEME_SELECTED_ID
    })
  },
  methods: {
    ...mapMutations({
      setObjectTypeSelected: MUTATES.SET_OBJECT_TYPE_SELECTED,
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
      toggleColorPicker: MUTATES.TOGGLE_COLOR_PICKER,
      setToolNameSelected: MUTATES.SET_TOOL_NAME_SELECTED
    }),
    /**
     * Detect click on item on right creation tool
     * @param  {Object} item Receive item information
     */
    onClickRightTool(item) {
      if (!this.printThemeSelectedId) {
        return;
      }
      switch (item.name) {
        case 'properties':
          if (!this.selectedObjectType) {
            return;
          }
          this.setIsOpenProperties({
            isOpen: !this.isOpenMenuProperties
          });
          this.toggleColorPicker({
            isOpen: false
          });
          this.setObjectTypeSelected({
            type: this.selectedObjectType
          });
          break;
        default:
          break;
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
      switch (data.name) {
        case TOOL_NAME.TEXT:
          this.addText();
          this.setToolNameSelected({
            name: TOOL_NAME.TEXT
          });
          break;
        case TOOL_NAME.DELETE:
          this.deleteElements();
          break;
        case TOOL_NAME.IMAGE_BOX:
          this.addImageBox();
          this.setToolNameSelected({
            name: TOOL_NAME.IMAGE_BOX
          });
          break;
        default:
          if (data.name === TOOL_NAME.LAYOUTS && this.isPrompt) {
            return;
          }
          this.setToolNameSelected({
            name: toolName
          });
          break;
      }
    },
    /**
     * Add text box in print canvas
     */
    addText() {
      this.$root.$emit('printAddElement', 'TEXT');
    },
    /**
     * Add image box in print canvas
     */
    addImageBox() {
      this.$root.$emit('printAddElement', 'IMAGE');
    },
    /**
     * Delete selected elements in print canvas
     */
    deleteElements() {
      this.$root.$emit('printDeleteElements');
    }
  }
};
