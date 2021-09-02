import { DEFAULT_PORTRAIT_RATIO } from '@/common/constants';
import { getConvertedPreviewValue, isEmpty } from '@/common/utils';

export default {
  props: {
    portraits: {
      type: Array,
      default: () => []
    },
    layout: {
      type: Object,
      default: () => ({})
    },
    backgroundUrl: {
      type: String
    }
  },
  data() {
    return {
      portraitData: [],
      defaultGap: 0.15,
      defaultRatio: DEFAULT_PORTRAIT_RATIO
    };
  },
  watch: {
    layout(value) {
      if (isEmpty(value)) return;

      this.updatePortraitData();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.updatePortraitData();
    });
  },
  methods: {
    /**
     * Update portrait data
     */
    updatePortraitData() {
      // order of function calls is matter
      this.updateMargins();
      this.updateLayout();
    },

    /**
     * To calculate width portrait and update layout on UI
     */
    updateLayout() {
      const row = this.layout.rowCount;
      const col = this.layout.colCount;

      const portraitsEl = this.$refs.portraits;

      const containerWidth = window.getComputedStyle(portraitsEl).width;
      const containerHeight = window.getComputedStyle(portraitsEl).height;

      const width =
        parseInt(containerWidth) / (col + (col - 1) * this.defaultGap);
      const height =
        parseInt(containerHeight) / (row + (row - 1) * this.defaultGap);

      const portraitWidth = Math.min(width, (height - 10) / this.defaultRatio);

      portraitsEl.style.setProperty('--row-count', this.layout.rowCount);
      portraitsEl.style.setProperty('--col-count', this.layout.colCount);

      portraitsEl.style.setProperty('--portrait-width', portraitWidth + 'px');
    },

    /**
     * To update margin based on layout settings
     */
    updateMargins() {
      const thumbWrapperEl = this.$refs.thumbWrapper;

      const margins = this.layout.margins;

      const top = getConvertedPreviewValue(margins.top);
      const bottom = getConvertedPreviewValue(margins.bottom);
      const left = getConvertedPreviewValue(margins.left);
      const right = getConvertedPreviewValue(margins.right);

      thumbWrapperEl.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
    }
  }
};
