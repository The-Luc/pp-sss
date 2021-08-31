import CommonModal from '../CommonModal';
import Item from './Item';
import { usePortrait } from '@/hooks';
import {
  insertItemsToArray,
  isEmpty,
  removeItemsFormArray
} from '@/common/utils';

export default {
  components: { CommonModal, Item },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    },
    noPortraitFolderLength: {
      type: Number,
      default: 4
    }
  },
  setup() {
    const { getPortraitFolders } = usePortrait();

    return {
      getPortraitFolders
    };
  },

  data() {
    return {
      portraitFolders: [],
      selectedFolders: []
    };
  },
  computed: {
    selectedFolderIds() {
      return this.selectedFolders.map(item => {
        return item.id;
      });
    },
    isEmpty() {
      return isEmpty(this.portraitFolders);
    },
    isDisableSelect() {
      return isEmpty(this.selectedFolders);
    }
  },
  methods: {
    /**
     * Close modal portrait folder
     */
    onCancel() {
      this.$emit('cancel');
    },
    /**
     * Select portrait folders
     */
    onSelect() {
      this.$emit('select', this.selectedFolders);
    },
    /**
     * Selected portrait folder
     * @param {Object}  folder  portrait folder
     */
    selectedPortraitFolder(folder) {
      const index = this.selectedFolders.findIndex(
        item => item.id === folder.id
      );

      if (index < 0) {
        this.selectedFolders = insertItemsToArray(this.selectedFolders, [
          { value: folder }
        ]);
      } else {
        this.selectedFolders = removeItemsFormArray(this.selectedFolders, [
          { value: folder, index }
        ]);
      }
    }
  },
  async created() {
    this.portraitFolders = await this.getPortraitFolders();
  }
};
