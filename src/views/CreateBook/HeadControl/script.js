import BookInformation from './BookInformation';
import BookControl from './BookControl';
import BookNumber from './BookNumber';

export default {
  components: {
    BookInformation,
    BookControl,
    BookNumber
  },
  data() {
    return {
      showHeader: true
    };
  },
  watch: {
    ['$route.path'](path) {
      this.checkShowHeader(path);
    }
  },
  methods: {
    checkShowHeader(path) {
      if (path === '/edit/print/edit-screen') {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
    }
  },
  created() {
    this.checkShowHeader(this.$route.path);
  }
};
