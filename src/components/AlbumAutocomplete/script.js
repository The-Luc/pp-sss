import { ICON_LOCAL } from '@/common/constants';
import Item from './Item';
import NewAlbum from './NewAlbum';

export default {
  components: {
    Item,
    NewAlbum
  },
  props: {
    albums: {
      type: Array,
      required: true
    },
    appendedIcon: {
      type: String,
      default: ICON_LOCAL.ARROW_SELECT
    }
  },
  data() {
    return {
      search: '',
      label: 'Select Album'
    };
  },
  methods: {
    /**
     * Create a album and emit to back value to parent
     */
    onCreateNewAlbum() {
      this.label = this.search?.trim() || 'Untitled';
      this.$emit('createNewAlbum', this.label);
    },
    /**
     * Select album and emit to back value to parent
     */
    onChange(val) {
      this.$emit('changeSelect', val);
    }
  }
};
