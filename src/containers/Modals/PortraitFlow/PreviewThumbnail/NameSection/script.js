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
    isPageRight: {
      type: Boolean,
      default: true
    },
    nameCssStyle: {
      type: Object,
      default: () => ({})
    },
    rowCssStyle: {
      type: Object,
      default: () => ({})
    },
    containerCssStyle: {
      type: Object,
      default: () => ({})
    }
  }
};
