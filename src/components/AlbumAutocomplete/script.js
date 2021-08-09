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
      search: ''
    };
  },
  methods: {
    /**
     * Create a album and emit to back value to parent
     */
    onCreateNewAlbum() {
      this.$emit('createNewAlbum', this.search);
    },
    /**
     * Select album and emit to back value to parent
     */
    onChange(val) {
      this.$emit('changeSelect', val);
    }
  }
};
