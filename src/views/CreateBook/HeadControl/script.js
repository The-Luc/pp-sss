import { BOOK_VIEW_TYPE, LOCAL_STORAGE } from '@/common/constants';
import BookInformation from './BookInformation';
import BookControl from './BookControl';
import BookNumber from './BookNumber';
import { getItem, setItem } from '@/common/storage';

export default {
  components: {
    BookInformation,
    BookControl,
    BookNumber
  },
  data() {
    return {
      currentView:
        getItem(LOCAL_STORAGE.CURRENT_SCREEN) || BOOK_VIEW_TYPE.MANAGER
    };
  },
  methods: {
    onChangeView(view) {
      this.currentView = view;
      setItem(LOCAL_STORAGE.CURRENT_SCREEN, view);
      this.$router.push(`/edit/${view.toLowerCase()}`);
    }
  }
};
