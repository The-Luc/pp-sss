import FolderName from './FolderName';

export default {
  components: {
    FolderName
  },
  props: {
    selectedFolders: {
      type: Array
    }
  },
  data() {
    return {
      isOverflowing: false
    };
  },
  computed: {
    totalPortraits() {
      return this.selectedFolders.reduce(
        (total, folder) => total + folder.assetsCount,
        0
      );
    },
    folderNames() {
      if (this.selectedFolders.length <= 1) {
        return [this.selectedFolders[0].name];
      }

      return this.selectedFolders.map(
        (folder, idx) => `(${idx + 1}) ${folder.name}`
      );
    },
    folderNameText() {
      return this.folderNames.join(', ');
    },
    isShowMoreDisplayed() {
      return this.isOverflowing && this.selectedFolders.length > 1;
    }
  },
  mounted() {
    this.$nextTick(() => {
      const el = this.$refs.folderText;
      if (!el) return;

      this.isOverflowing = el.scrollWidth > el.offsetWidth;
    });
  }
};
