export default {
  props: {
    section: Object
  },
  computed: {
    isTypeFull() {
      return this.sheet.type == 'full';
    }
  }
};
