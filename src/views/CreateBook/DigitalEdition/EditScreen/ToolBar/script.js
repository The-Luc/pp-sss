import { mapMutations, mapGetters } from 'vuex';
import ToolButton from '@/components/Buttons/ToolButton';
import ItemTool from './ItemTool';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import {
  OBJECT_TYPE,
  DIGITAL_RIGHT_TOOLS,
  TOOL_NAME
} from '@/common/constants';
import { EVENT_TYPE } from '@/common/constants/eventType';
import { isEmpty } from '@/common/utils';

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
            title: TOOL_NAME.IMAGE_BOX
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
            iconName: 'post_add',
            title: 'Screen Notes'
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
        [
          {
            iconName: 'list_alt',
            title: 'Frame Info',
            name: DIGITAL_RIGHT_TOOLS.FRAME_INFO.value
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
      propertiesObjectType: GETTERS.PROPERTIES_OBJECT_TYPE,
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: GETTERS.SELECTED_TOOL_NAME,
      printThemeSelectedId: BOOK_GETTERS.PRINT_THEME_SELECTED_ID
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
      if (this.selectedToolName === item?.name) return;

      this.$root.$emit(EVENT_TYPE.SWITCH_TOOL, item?.name);

      switch (item.name) {
        case 'properties':
          if (!this.selectedObjectType) {
            return;
          }
          this.setIsOpenProperties({
            isOpen: !this.isOpenMenuProperties
          });
          this.setObjectTypeSelected({
            type: OBJECT_TYPE.TEXT
          });
          break;
        case 'text':
          console.log(1);
          break;
        case DIGITAL_RIGHT_TOOLS.FRAME_INFO.value:
          this.NoneElementPropertiesClick(DIGITAL_RIGHT_TOOLS.FRAME_INFO.value);
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
      if (
        // !this.printThemeSelectedId || //not yet implemented
        !data?.name ||
        this.selectedToolName === data?.name
      ) {
        return;
      }

      this.$root.$emit(EVENT_TYPE.SWITCH_TOOL, data.name);

      this.setToolNameSelected({
        name: data.name
      });

      if (data.name === TOOL_NAME.TEXT) {
        this.$root.$emit(EVENT_TYPE.DIGITAL_ADD_ELEMENT, OBJECT_TYPE.TEXT);
      }
    },
    /**
     * Fire when click on Page Info button or Background Properties button
     */
    NoneElementPropertiesClick(objectType) {
      const isToggle =
        isEmpty(this.selectedObjectType) ||
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
