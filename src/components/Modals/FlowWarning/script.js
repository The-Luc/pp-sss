import CommonModal from '@/containers/Modals/CommonModal';

export default {
  components: { CommonModal },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    },
    descript: {
      type: String,
      required: false
    }
  },
  methods: {
    /**
     * Select portrait folders
     */
    onSelect() {
      this.$emit('select', this.selectedFolders);
    }
  }
};
