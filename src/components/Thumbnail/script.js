import IMAGE_LOCAL from '@/common/constants/image';
export default {
  props: {
    sheet: Object,
    sections: Array,
    sectionId: String
  },
  created() {
    this.image =
      this.sheet.printData.thumbnailUrl || IMAGE_LOCAL.BACKGROUND_WHITE;
  },
  computed: {
    isTypeFull() {
      return this.sheet.type === 'full';
    },
    numberPage() {
      let indexInBook = 0;
      const section = this.sections.find(item => item.id == this.sectionId);
      console.log(this.sections);
      for (let i = 0; i < section.order; i++) {
        indexInBook += this.sections[0].sheets.length;
      }
      indexInBook += this.sheet.order + 1;
      console.log(indexInBook);
      let numberPage;
      switch (section.order) {
        case 0:
          numberPage = {
            left: 'Back Cover',
            right: 'Front Cover'
          };
          break;
        case 1:
          if (this.sheet.order === 0) {
            numberPage = {
              left: 'Inside Front Cover',
              right: indexInBook * 2 + 2
            };
          } else {
            numberPage = {
              left: indexInBook * 2 + 1,
              right: indexInBook * 2 + 2
            };
          }
          break;
        case this.sections.length - 1:
          if (this.sheet.order === section.sheets.length - 1) {
            numberPage = {
              left: indexInBook * 2 + 1,
              right: 'Inside Back Cover'
            };
          } else {
            numberPage = {
              left: indexInBook * 2 + 1,
              right: indexInBook * 2 + 2
            };
          }
          break;
        default:
          numberPage = {
            left: indexInBook * 2 + 1,
            right: indexInBook * 2 + 2
          };
          break;
      }
      return numberPage;
    }
  }
};
