import {
  DEFAULT_PORTRAIT_RATIO,
  PORTRAIT_NAME_DISPLAY,
  PORTRAIT_NAME_POSITION,
  CLASS_ROLE,
  PORTRAIT_SIZE
} from '@/common/constants';
import { isEmpty, inToPxPreview } from '@/common/utils';
import { toCssPreview, toMarginCssPreview } from '@/common/fabricObjects';

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
    },
    pageNumber: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      portraitData: [],
      defaultGap: 0.15,
      defaultRatio: DEFAULT_PORTRAIT_RATIO,
      portraitWidth: 0,
      namesHeight: {},
      previewHeight: 0
    };
  },
  computed: {
    nameTextStyle() {
      const {
        nameTextFontSettings,
        nameLines,
        nameGap
      } = this.flowSettings.textSettings;

      const style = toCssPreview(
        {
          isFirstLastDisplay: this.isFirstLastDisplay,
          nameLines,
          ...nameTextFontSettings
        },
        this.previewHeight
      );

      if (nameLines === 2) {
        style.justifyContent = this.isFirstLastDisplay
          ? style.justifyContent
          : 'flex-end';
      }

      if (!this.isCenterPosition) {
        style.paddingBottom = `${this.convertIntoPx(nameGap)}px`;
      }

      return style;
    },
    pageTitleStyle() {
      const {
        pageTitleFontSettings,
        isPageTitleOn,
        pageTitleMargins
      } = this.flowSettings.textSettings;

      return toCssPreview(
        {
          isPageTitleOn,
          ...pageTitleFontSettings,
          ...pageTitleMargins
        },
        this.previewHeight
      );
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
    },
    nameContainerStyle() {
      const { nameWidth } = this.flowSettings.textSettings;

      const style = toMarginCssPreview(
        { ...this.layout.margins },
        this.previewHeight
      );

      style.width = `${this.convertIntoPx(nameWidth)}px`;

      if (this.showPageTitile) style.marginTop = '0px';

      return style;
    },
    namePortrait() {
      const arrayPortrait = Object.values(this.portraits);
      const result = [];

      while (arrayPortrait.length) {
        const item = arrayPortrait.splice(0, this.layout.colCount);
        result.push(item);
      }

      return result;
    },
    isPageRight() {
      return this.pageNumber % 2 === 0;
    }
  },
  watch: {
    layout(value) {
      if (isEmpty(value)) return;

      this.updatePortraitData();
    },
    pageNumber(newVal, oldVal) {
      if (newVal !== oldVal) this.updatePortraitData();
    },
    flowSettings: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.$nextTick(() => {
            const pageTitleHeight = this.$refs?.pageTitle?.clientHeight;
            const height = this.showPageTitile ? pageTitleHeight : 0;

            const row = this.layout.rowCount;
            const nameContainerHeight = this.$refs?.portraits?.clientHeight;
            const imageHeight = this.portraitWidth * 1.25;
            // gridHeight is made up image height + name height (name height is 10% of image height)
            const gridHeight = imageHeight + imageHeight * 0.1;
            const gap = (nameContainerHeight - gridHeight * row) / (row - 1);

            this.namesHeight = { height: `${gridHeight + gap}px` };

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
      this.previewHeight = this.$refs.thumbWrapper.clientHeight;
      this.updatePortraitData();
    });
  },
  methods: {
    /**
     * Update portrait data
     */
    updatePortraitData() {
      // order of function calls is matter
      this.setThumbWrapperHeight();
      this.updateMargins();
      this.updateLayout();
      this.setNamesHeight();
      this.updateLargePortraitSize();
    },

    /**
     * To calculate width portrait and update layout on UI
     */
    updateLayout() {
      const portraitsEl = this.$refs.portraits;
      const portraitsContainerEl = this.$refs.portraitsContainer;

      if (!portraitsEl.style) return;

      const row = this.layout.rowCount;
      const col = this.layout.colCount;

      const containerWidth = portraitsContainerEl.clientWidth;
      const containerHeight = portraitsContainerEl.clientHeight;

      const width =
        parseInt(containerWidth) / (col + (col - 1) * this.defaultGap);
      const height =
        parseInt(containerHeight) / (row + (row - 1) * this.defaultGap);

      this.portraitWidth = Math.min(
        width,
        (height - height * 0.1) / this.defaultRatio
      );

      portraitsEl.style.setProperty('--row-count', this.layout.rowCount);
      portraitsEl.style.setProperty('--col-count', this.layout.colCount);

      portraitsEl.style.setProperty(
        '--portrait-width',
        this.portraitWidth + 'px'
      );

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
      const nameWidth = this.flowSettings.textSettings.nameWidth;

      const top = this.showPageTitile ? 0 : this.convertIntoPx(margins.top);

      const bottom = this.convertIntoPx(margins.bottom);

      const offset = this.isCenterPosition ? 0 : this.convertIntoPx(nameWidth);

      const offsetRight = this.isPageRight ? offset : 0;
      const offsetLeft = this.isPageRight ? 0 : offset;

      const left = this.convertIntoPx(margins.left) + offsetLeft;

      const right = this.convertIntoPx(margins.right) + offsetRight;

      thumbWrapperEl.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
    },
    /**
     * Set height for name container when position name is outside
     */
    setNamesHeight() {
      const row = this.layout.rowCount;
      const nameContainerHeight = this.$refs?.portraits?.clientHeight;
      const gridHeight = this.portraitWidth * 1.25 + 10;
      const gap = (nameContainerHeight - gridHeight * row) / (row - 1);

      this.namesHeight = { height: `${gridHeight + gap}px` };
    },
    /**
     * Set height for thumbnail wrapper container when has page title
     */
    setThumbWrapperHeight() {
      const pageTitleHeight = this.$refs?.pageTitle?.clientHeight;
      const height = this.showPageTitile ? pageTitleHeight : 0;

      this.$refs.thumbWrapper.style.height = `calc(100% - ${height}px)`;
    },
    /**
     * Convert value from in to px
     */
    convertIntoPx(value) {
      return inToPxPreview(value, this.previewHeight);
    },

    /**
     *  Fire when loop through portraits
     * To dynamically adding class for styling
     *
     * @param {Object} portrait portraits which displayed on preview
     * @returns class string for styling
     */
    isLargePortrait(portrait) {
      const {
        hasTeacher,
        teacherPortraitSize,
        assistantTeacherPortraitSize
      } = this.flowSettings.teacherSettings;

      if (!hasTeacher) return false;

      const isEnlargeTeacher =
        portrait.classRole === CLASS_ROLE.PRIMARY_TEACHER &&
        teacherPortraitSize === PORTRAIT_SIZE.LARGE;

      const isEnlargeAsst =
        portrait.classRole === CLASS_ROLE.ASSISTANT_TEACHER &&
        assistantTeacherPortraitSize === PORTRAIT_SIZE.LARGE;

      return isEnlargeAsst || isEnlargeTeacher;
    },

    /**
     * Update large portrait: class name & css style
     */
    updateLargePortraitSize() {
      const portraitsEl = this.$refs.portraits;
      const largeEl = portraitsEl.querySelector('.enlarge');

      if (!largeEl) return;
      const rawWidth = window.getComputedStyle(largeEl).width;
      const rawHeight = window.getComputedStyle(largeEl).height;

      const width = parseFloat(rawWidth);
      const height = parseFloat(rawHeight);

      if (!width || !height) return;

      const calcHeight = width * 1.25;
      const enlargeHeight = Math.min(height, calcHeight);
      const endlargeWidth = (enlargeHeight - 10) * 0.8 + 'px';

      portraitsEl.style.setProperty('--enlarge-width', endlargeWidth);
    }
  }
};
