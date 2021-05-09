import { LOCAL_STORAGE } from '@/common/constants';
import { getItem, setItem } from '@/common/storage';
import Item from './Item';

export default {
  components: {
    Item
  },
  data() {
    return {
      isOpen: false,
      currentId: ''
    };
  },
  props: {
    nudgeWidth: {
      type: String,
      default: '160'
    },
    src: {
      type: String
    },
    id: {
      type: String
    },
    items: {
      type: Array
    }
  },
  methods: {
    onItemClick(event, item) {
      this.$emit('onItemClick', {
        event,
        item
      });
    },
    onClick() {
      const currentId = getItem(LOCAL_STORAGE.CURRENT_MENU);
      if (!currentId) {
        this.isOpen = true;
        this.$emit('onClick');
      } else {
        setItem(LOCAL_STORAGE.CURRENT_MENU, this.id);
        this.isOpen = currentId === this.id;
      }
    }
  }
};
