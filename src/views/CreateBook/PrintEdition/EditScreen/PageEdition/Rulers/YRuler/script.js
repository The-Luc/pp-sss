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
      if (!this.pageSize || !this.canvasSize) {
        return {
          count: 0,
          height: 0,
          bleedY: 0
        };
      }

      const {
        inches: { pdfHeight, bleedY, spineWidth }
      } = this.pageSize;
      const { height } = this.canvasSize;

      return {
        height: height / pdfHeight,
        count: Math.floor(pdfHeight),
        bleedY: spineWidth > 0 ? 0 : bleedY
      };
    },
    unitArray() {
      const { count, height } = this.config;

      if (!height) return [];

      const units = [];

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
