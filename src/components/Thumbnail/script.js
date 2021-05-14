import IMAGE_LOCAL from '@/common/constants/image';
export default {
  props: {
    sheet: {
      type: Object
    },
    sections: {
      type: Array
    },
    sectionId: {
      type: String
    },
    edit: {
      type: Boolean,
      default: true
    },
    link: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.image =
      this.sheet.printData.thumbnailUrl || IMAGE_LOCAL.BACKGROUND_WHITE;
  },
  computed: {
    isTypeFull() {
      return this.sheet.type === 'full';
    }
    // numberPage() {
    //   const section = this.sections.find(item => item.id == this.sectionId);
    //   let indexInSections = 0;
    //   for (let i = 0; i < section.order; i++) {
    //     indexInSections += this.sections[i].sheets.length;
    //   }
    //   indexInSections += this.sheet.order + 1;
    //   let numberLeft = indexInSections * 2 - 4;
    //   let numberRight = indexInSections * 2 - 3;
    //   if (numberLeft < 10) {
    //     numberLeft = '0' + numberLeft;
    //   }
    //   if (numberLeft < 10) {
    //     numberRight = '0' + numberRight;
    //   }
    //   let numberPage;
    //   switch (section.order) {
    //     case 0:
    //       numberPage = {
    //         numberLeft: 'Back Cover',
    //         numberRight: 'Front Cover'
    //       };
    //       break;
    //     case 1:
    //       if (this.sheet.order === 0) {
    //         numberPage = {
    //           numberLeft: 'Inside Front Cover',
    //           numberRight
    //         };
    //       } else {
    //         numberPage = {
    //           numberLeft,
    //           numberRight
    //         };
    //       }
    //       break;
    //     case this.sections.length - 1:
    //       if (this.sheet.order === section.sheets.length - 1) {
    //         numberPage = {
    //           numberLeft,
    //           numberRight: 'Inside Back Cover'
    //         };
    //       } else {
    //         numberPage = {
    //           numberLeft,
    //           numberRight
    //         };
    //       }
    //       break;
    //     default:
    //       numberPage = {
    //         numberLeft,
    //         numberRight
    //       };
    //       break;
    //   }
    //   return numberPage;
    // }
  }
};
