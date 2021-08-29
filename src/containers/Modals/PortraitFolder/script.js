import CommonModal from '../CommonModal';
import { usePortrait } from '@/hooks';

export default {
  components: { CommonModal },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
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
      portraitFoldes: []
    };
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
      this.$emit('select', [this.portraitFoldes[0]]);
    }
  },
  async created() {
    this.portraitFoldes = await this.getPortraitFolders();
  }
};
