import ToolButton from '@/components/ToolButton';
import ItemTool from './ItemTool';
export default {
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
            title: 'Page Info'
          },
          {
            iconName: 'wysiwyg',
            title: 'Properties'
          }
        ]
      ]
    };
  },
  methods: {
    themes() {
      console.log(0);
    }
  }
};
