export default {
  props: {
    portraitFolder: {
      type: Object,
      default: () => ({ id: '' })
    },
    selectedFolderIds: {
      type: Array,
      default: () => []
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    isDigital: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isActive() {
      return this.selectedFolderIds.includes(this.portraitFolder.id);
    },
    isSelected() {
      return this.portraitFolder.isSelected;
    }
  },
  methods: {
    /**
     * Emit portrait folder selected to parent
     */
    onClick() {
      this.$emit('click', this.portraitFolder);
    }
  }
};
