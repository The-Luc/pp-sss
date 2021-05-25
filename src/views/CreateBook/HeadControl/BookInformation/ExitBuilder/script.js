import { ICON_LOCAL, ROUTE_NAME } from '@/common/constants';

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
    ['$route.name'](path) {
      this.checkShowExit(path);
    }
  },
  methods: {
    /**
     * Check show Exit Yearbook Builder button with path name
     * @param  {String} pathName Current path name
     */
    checkShowExit(pathName) {
      if (
        pathName === ROUTE_NAME.PRINT_EDIT ||
        pathName === ROUTE_NAME.DIGITAL_EDIT
      ) {
        this.showExit = false;
      } else {
        this.showExit = true;
      }
    }
  }
};
