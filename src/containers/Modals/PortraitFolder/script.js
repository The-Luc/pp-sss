import CommonModal from '@/components/Modals/CommonModal';
import Item from './Item';
import ReflowPortrait from './ReflowPortrait';
import { usePortrait } from '@/hooks';
import {
  insertItemsToArray,
  isEmpty,
  removeItemsFormArray
} from '@/common/utils';

export default {
  components: { CommonModal, Item, ReflowPortrait },
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
      selectedFolders: [],
      isOpenReflowPortrait: false
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
    },
    flowedFolders() {
      return this.selectedFolders.filter(item => item.isSelected);
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
      if (isEmpty(this.flowedFolders) || this.isOpenReflowPortrait) {
        this.$emit('select', this.selectedFolders);
        return;
      }
      this.isOpenReflowPortrait = true;
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
