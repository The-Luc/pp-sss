import { mapMutations, mapGetters } from 'vuex';
import ToolButton from '@/components/Buttons/ToolButton';
import ItemTool from './ItemTool';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';
import {
  OBJECT_TYPE,
  TOOL_NAME,
  EVENT_TYPE,
  DIGITAL_RIGHT_TOOLS
} from '@/common/constants';
import { isEmpty, getRightToolItems } from '@/common/utils';

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
            title: 'Image',
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
  computed: {
    ...mapGetters({
      selectedObjectType: GETTERS.SELECTED_OBJECT_TYPE,
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedToolName: GETTERS.SELECTED_TOOL_NAME,
      printThemeSelectedId: BOOK_GETTERS.PRINT_THEME_SELECTED_ID,
      currentBackgrounds: DIGITAL_GETTERS.BACKGROUNDS,
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
      if (item.name === DIGITAL_RIGHT_TOOLS.PROPERTIES.value) {
        if (!this.selectedObjectType) {
          return;
        }

        this.setIsOpenProperties({
          isOpen: !this.isOpenMenuProperties
        });

        this.setObjectTypeSelected({
          type: OBJECT_TYPE.TEXT
        });

        return;
      }

      if (item.name === DIGITAL_RIGHT_TOOLS.BACKGROUND.value) {
        this.propertiesClick(OBJECT_TYPE.BACKGROUND);

        return;
      }

      if (item.name === DIGITAL_RIGHT_TOOLS.FRAME_INFO.value) {
        this.propertiesClick(DIGITAL_RIGHT_TOOLS.FRAME_INFO.value);

        return;
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
     * Fire when click on Menu Properties button
     */
    propertiesClick(objectType) {
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
