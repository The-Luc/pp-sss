export default {
  props: {
    sheet: Object,
    edit: {
      type: Boolean,
      default: true
    },
    link: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isTypeFull() {
      return this.sheet.type == 'full';
    }
  }
};
