import YUnit from './YUnit';

export default {
  components: {
    YUnit
  },
  props: {
    pageSize: {
      type: Object,
      default: null
    },
    canvasSize: {
      type: Object,
      default: null
    }
  },
  computed: {
    config() {
      const conf = {
        count: 0,
        height: 0,
        bleedY: 0
      };
      if (this.pageSize && this.canvasSize) {
        const {
          inches: { pdfHeight, bleedY, spineWidth }
        } = this.pageSize;
        const { height } = this.canvasSize;
        conf.height = height / pdfHeight;
        conf.count = Math.floor(pdfHeight);
        conf.bleedY = spineWidth > 0 ? 0 : bleedY;
      }
      return conf;
    },
    unitArray() {
      const units = [];
      const { count, height } = this.config;
      if (height) {
        let i = 0;
        while (i <= count) {
          const unitData = {
            number: Math.abs(i),
            topBorder: true,
            bottomBorder: i === count
          };
          units.push(unitData);
          i++;
        }
      }
      return units;
    },
    containerStyle() {
      const { height, bleedY } = this.config;
      if (!height) {
        return { height: 0 };
      }
      return {
        height: this.unitArray.length * height + 'px',
        top: (bleedY === 0 ? 0 : bleedY * height) - 1 + 'px'
      };
    }
  }
};
