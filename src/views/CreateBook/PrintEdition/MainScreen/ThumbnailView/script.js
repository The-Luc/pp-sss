export default {
  props: {
    section: Object,
    sheet: Object
  },
  computed: {
    isTypeFull() {
      return this.sheet.type == 'full';
    }
  }
};