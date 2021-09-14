import NameItem from '../NameItem';

export default {
  components: {
    NameItem
  },
  props: {
    portraits: {
      type: Array,
      default: () => []
    },
    isFirstLastDisplay: {
      type: Boolean,
      default: true
    },
    isCenterPosition: {
      type: Boolean,
      default: true
    },
    nameCssStyle: {
      type: Object,
      default: () => ({})
    }
  }
};
