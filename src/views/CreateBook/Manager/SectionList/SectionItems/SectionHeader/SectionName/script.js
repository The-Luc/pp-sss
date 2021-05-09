export default {
  data() {
    return {
      sectionNameCurrent: this.sectionName
    }
  },
  props: ['sectionId', 'sectionName', 'sectionColor'],
  methods: {
    saveTitle(event) {
      event.target.blur();
      this.sectionNameCurrent = this.sectionNameCurrent || 'Untitled'
    },
    keyUpEsc(event) {
      event.target.blur();
      this.sectionNameCurrent = this.sectionName;
    }
  }
};
