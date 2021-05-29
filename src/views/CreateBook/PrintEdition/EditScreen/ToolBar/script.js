import { mapMutations, mapGetters } from 'vuex';
import { fabric } from 'fabric';
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
            name: 'text'
          },
          {
            iconName: 'photo_size_select_large',
            title: 'Image Box'
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
            title: 'Delete'
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
          // if (!this.selectedObjectType) {
          //   return;
          // }
          this.setIsOpenProperties({
            isOpen: !this.isOpenMenuProperties
          });
          this.setObjectTypeSelected({
            type: OBJECT_TYPE.TEXT
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
        case 'text':
          this.addText();
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
      var text = new fabric.IText('Text', {
        fontFamily: 'Comic Sans',
        originX: 'left',
        originY: 'top',
        left: 51,
        top: 282
      });
      window.printCanvas.add(text);
      const index = window.printCanvas.getObjects().length - 1;
      window.printCanvas.setActiveObject(window.printCanvas.item(index));
    }
  }
};
