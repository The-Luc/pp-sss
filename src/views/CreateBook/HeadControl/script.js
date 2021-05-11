import { CURRENT_SCREEN, LOCAL_STORAGE } from '@/common/constants';
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
        getItem(LOCAL_STORAGE.CURRENT_SCREEN) || CURRENT_SCREEN.MANAGER
    };
  },
  mounted() {
    console.log('currentView', this.$router);
  },
  methods: {
    onChangeView(view) {
      this.currentView = view;
      setItem(LOCAL_STORAGE.CURRENT_SCREEN, view);
      this.$router.push(`/edit/${view.toLowerCase()}`);
    }
  }
};
