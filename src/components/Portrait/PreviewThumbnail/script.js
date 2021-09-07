import {
  DEFAULT_PORTRAIT_RATIO,
  PORTRAIT_NAME_DISPLAY,
  PORTRAIT_NAME_POSITION
} from '@/common/constants';
import { isEmpty, inToPxPreview } from '@/common/utils';
import { toCssPreview } from '@/common/fabricObjects';

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
    },
    flowSettings: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      portraitData: [],
      defaultGap: 0.15,
      defaultRatio: DEFAULT_PORTRAIT_RATIO
    };
  },
  computed: {
    nameTextStyle() {
      const {
        nameTextFontSettings,
        nameLines
      } = this.flowSettings.textSettings;

      const style = toCssPreview({
        isCenterPosition: this.isCenterPosition,
        isFirstLastDisplay: this.isFirstLastDisplay,
        nameLines,
        ...nameTextFontSettings
      });

      if (nameLines === 2) {
        style.justifyContent = this.isFirstLastDisplay
          ? style.justifyContent
          : 'flex-end';
      }

      return style;
    },
    pageTitleStyle() {
      const {
        pageTitleFontSettings,
        isPageTitleOn,
        pageTitleMargins
      } = this.flowSettings.textSettings;

      return toCssPreview({
        isPageTitleOn,
        ...pageTitleFontSettings,
        ...pageTitleMargins
      });
    },
    isCenterPosition() {
      const { namePosition } = this.flowSettings.textSettings;
      return namePosition.value === PORTRAIT_NAME_POSITION.CENTERED.value;
    },
    showPageTitile() {
      return this.flowSettings.textSettings.isPageTitleOn;
    },
    isFirstLastDisplay() {
      const { nameDisplay } = this.flowSettings.textSettings;
      return nameDisplay.value === PORTRAIT_NAME_DISPLAY.FIRST_LAST.value;
    }
  },
  watch: {
    layout(value) {
      if (isEmpty(value)) return;

      this.updatePortraitData();
    },
    flowSettings: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.$nextTick(() => {
            const pageTitleHeight = this.$refs?.pageTitle?.clientHeight;
            const height = this.showPageTitile ? pageTitleHeight : 0;

            if (pageTitleHeight) {
              this.$refs.thumbWrapper.style.height = `calc(100% - ${height}px)`;
            }

            this.updatePortraitData();
          });
        }
      }
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
      const portraitsEl = this.$refs.portraits;
      if (!portraitsEl.style) return;

      const row = this.layout.rowCount;
      const col = this.layout.colCount;

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

      if (row === 1 && col === 1) {
        portraitsEl.style.setProperty('--align', 'center');
        return;
      }

      portraitsEl.style.setProperty('--align', 'space-between');
    },

    /**
     * To update margin based on layout settings
     */
    updateMargins() {
      const thumbWrapperEl = this.$refs.thumbWrapper;
      if (!thumbWrapperEl.style) return;

      const margins = this.layout.margins;

      const top = this.showPageTitile ? 0 : inToPxPreview(margins.top);
      const bottom = inToPxPreview(margins.bottom);
      const left = inToPxPreview(margins.left);
      const right = inToPxPreview(margins.right);

      thumbWrapperEl.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
    }
  }
};
