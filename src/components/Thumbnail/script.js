export default {
  props: {
    sheet: Object
  },
  computed: {
    isTypeFull() {
      return this.sheet.type == 'full';
    }
  }
};