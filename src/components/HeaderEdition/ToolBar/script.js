import { mapMutations, mapGetters } from 'vuex';

import ToolButton from '@/components/ToolButton';
import ItemTool from './ItemTool';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { OBJECT_TYPE } from '@/common/constants';

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
            title: 'Themes'
          },
          {
            iconName: 'import_contacts',
            title: 'Layouts'
          },
          {
            iconName: 'texture',
            title: 'Backgrounds'
          },
          {
            iconName: 'local_florist',
            title: 'Clip Art'
          }
        ],
        [
          {
            iconName: 'star',
            title: 'Shapes'
          },
          {
            iconName: 'text_format',
            title: 'Text'
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
  created() {
    if (!this.isDigitalEditor) return;
    this.itemsToolRight = [
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
      ...this.itemsToolRight
    ];
  },
  computed: {
    ...mapGetters({
      selectedObjectType: GETTERS.SELECTED_OBJECT_TYPE,
      isOpenMenuProperties: GETTERS.IS_OPEN_MENU_PROPERTIES
    })
  },
  methods: {
    ...mapMutations({
      setObjectTypeSelected: MUTATES.SET_OBJECT_TYPE_SELECTED,
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES
    }),
    /**
     * Detect click on item on right creation tool
     * @param  {Object} item Receive item information
     */
    onClickRightTool(item) {
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
      // To do later
    }
  }
};
