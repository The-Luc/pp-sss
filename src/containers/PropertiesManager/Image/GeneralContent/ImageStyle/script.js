export default {
  data() {
    return {
      isShowDropdown: false
    };
  },
  methods: {
    onOpenDropdown() {
      this.isShowDropdown = true;
    },
    onCloseDropdown() {
      this.isShowDropdown = false;
    }
  }
};
