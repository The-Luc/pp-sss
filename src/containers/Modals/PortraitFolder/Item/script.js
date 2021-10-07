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
    isPrintSelected() {
      return this.portraitFolder.isSelected.print;
    },
    isDigitalSelected() {
      return this.portraitFolder.isSelected.digital;
    },
    isActiveIcon() {
      return this.isDigital ? this.isDigitalSelected : this.isPrintSelected;
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
