import { ICON_LOCAL } from '@/common/constants';

export default {
  data() {
    return {
      showExit: true
    };
  },
  created() {
    this.ICON_LOCAL = ICON_LOCAL;
    this.checkShowExit(this.$route.path);
  },
  watch: {
    ['$route.path'](path) {
      this.checkShowExit(path);
    }
  },
  methods: {
    checkShowExit(path) {
      if (path === '/edit/print/edit-screen') {
        this.showExit = false;
      } else {
        this.showExit = true;
      }
    }
  }
};
