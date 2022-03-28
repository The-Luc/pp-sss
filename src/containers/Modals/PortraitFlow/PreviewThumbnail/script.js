import NameSection from './NameSection';
import PortraitSection from './PortraitSection';

import {
  DEFAULT_PORTRAIT_RATIO,
  PORTRAIT_NAME_DISPLAY,
  PORTRAIT_NAME_POSITION,
  CLASS_ROLE,
  PORTRAIT_SIZE,
  CSS_PORTRAIT_IMAGE_MASK,
  BORDER_STYLES,
  PORTRAIT_TEACHER_PLACEMENT
} from '@/common/constants';
import {
  isEmpty,
  inToPxPreview,
  ptToPxPreview,
  calcAdditionPortraitSlot
} from '@/common/utils';
import {
  toCssPreview,
  toMarginCssPreview,
  toCssBorder,
  toCssShadow
} from '@/common/fabricObjects';

export default {
  components: {
    NameSection,
    PortraitSection
  },
  props: {
    portraits: {
      type: Array,
      default: () => []
    },
    layout: {
      type: Object,
      default: () => ({})
    },
    background: {
      type: Object,
      default: () => ({})
    },
    isFullBackground: {
      type: Boolean,
      default: false
    },
    flowSettings: {
      type: Object,
      default: () => ({})
    },
    pageNumber: {
      type: Number,
      default: 0
    },
    isDigital: {
      type: Boolean,
      default: false
    },
    screenNumber: {
      type: Number
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
    lineHeight() {
      const { fontSize } = this.flowSettings.textSettings.nameTextFontSettings;
      const lineHeight = this.convertPttoPx(fontSize);
      const { nameLines } = this.flowSettings.textSettings;

      return this.isCenterPosition ? parseFloat(lineHeight) * nameLines : 0;
    },
    nameTextStyle() {
      if (isEmpty(this.flowSettings)) return {};

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
        this.previewHeight,
        this.isDigital
      );

      if (nameLines === 2) {
        style.justifyContent = this.isFirstLastDisplay
          ? style.justifyContent
          : 'flex-end';
      }

      if (!this.isCenterPosition) {
        style.marginBottom = `${this.convertIntoPx(nameGap)}px`;
        style.height = `${this.convertPttoPx(nameTextFontSettings.fontSize)}px`;
      } else {
        style.marginTop = `${this.convertIntoPx(0.1)}px`;
      }

      return style;
    },
    pageTitleStyle() {
      if (isEmpty(this.flowSettings)) return {};

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
        this.previewHeight,
        this.isDigital
      );
    },
    isCenterPosition() {
      const namePosition = this.flowSettings.textSettings?.namePosition;

      return namePosition?.value === PORTRAIT_NAME_POSITION.CENTERED.value;
    },
    showPageTitile() {
      if (isEmpty(this.flowSettings)) return false;

      const {
        flowMultiSettings,
        flowSingleSettings,
        startOnPageNumber,
        textSettings,
        folders
      } = this.flowSettings;

      const isMultiFolder =
        folders.length > 1 ? flowMultiSettings : flowSingleSettings;

      const isStartPageNumber = this.isDigital
        ? this.pageNumber === isMultiFolder.screen[this.screenNumber][0]
        : this.pageNumber === startOnPageNumber;

      if (isStartPageNumber) return textSettings?.isPageTitleOn;

      return false;
    },
    isFirstLastDisplay() {
      const nameDisplay = this.flowSettings.textSettings?.nameDisplay;

      return nameDisplay?.value === PORTRAIT_NAME_DISPLAY.FIRST_LAST.value;
    },
    nameContainerStyle() {
      if (isEmpty(this.flowSettings)) return {};

      const { nameWidth } = this.flowSettings.textSettings;
      const nameContainerWidth = this.$refs.portraitsSection?.$el.clientWidth;
      const col = this.layout.colCount;
      const gapWidth =
        (nameContainerWidth - this.portraitWidth * col) / (col - 1);

      const style = toMarginCssPreview(
        { ...this.layout.margins },
        this.previewHeight,
        this.isDigital
      );

      if (this.isPageRight) {
        style.paddingLeft = `${gapWidth}px`;
      } else {
        style.paddingRight = `${gapWidth}px`;
      }

      style.width = `${this.convertIntoPx(nameWidth)}px`;

      if (this.showPageTitile) style.marginTop = '0px';

      return style;
    },
    portraitNames() {
      if (isEmpty(this.flowSettings)) return [];

      const { teacherSettings, folders } = this.flowSettings;

      const { rowCount, colCount } = this.layout;
      const teacherPlacement = teacherSettings.teacherPlacement;

      const numLargePortrait =
        calcAdditionPortraitSlot(teacherSettings, folders[0].assets) / 3;

      const portraitArray = Object.values(this.portraits);
      const portraitNameArray = [];

      const isLargePortraitOnFirst =
        teacherPlacement === PORTRAIT_TEACHER_PLACEMENT.FIRST &&
        numLargePortrait > 0;

      const lastRowCount = this.portraits.length % colCount || colCount;
      const isOneLine =
        lastRowCount > 1 && lastRowCount + numLargePortrait <= colCount;

      if (isLargePortraitOnFirst) {
        const portraitNames = this.calcPortraitNameForLargOnFirst(
          portraitArray,
          numLargePortrait,
          isOneLine,
          lastRowCount
        );

        if (portraitNames) return portraitNames;
      }

      const spliceVal = lastRowCount === 1 ? colCount : lastRowCount;
      const portraitLength = this.portraits.length + numLargePortrait;
      const lastRow = Math.floor(portraitLength / colCount);

      for (let i = 1; i <= rowCount; i++) {
        const numPortraitForRow = i === lastRow ? spliceVal - 1 : colCount;
        portraitNameArray.push(portraitArray.splice(0, numPortraitForRow));
      }

      return portraitNameArray;
    },
    isPageRight() {
      if (this.isDigital) return false;
      return this.pageNumber % 2 !== 0;
    },
    imageStyle() {
      if (isEmpty(this.flowSettings)) return {};

      const { border, shadow, mask } = this.flowSettings.imageSettings;
      const { strokeLineType, strokeWidth } = border;
      const { borderColor, borderWidth, borderStyle } = toCssBorder(
        border,
        this.previewHeight
      );
      const {
        shadowBlur,
        shadowOffsetX,
        shadowOffsetY,
        shadowColor,
        dropShadow
      } = toCssShadow(shadow, this.previewHeight);
      const { height: imageHeight, borderRadius } = CSS_PORTRAIT_IMAGE_MASK[
        mask
      ].style;

      const isDoubleBorder = strokeLineType === BORDER_STYLES.DOUBLE;

      const doubleBorderDisplay = isDoubleBorder ? 'block' : 'none';
      const doubleBorderWidth = `${Math.round(
        this.convertPttoPx(strokeWidth) / 4
      )}px`;
      const doubleBorderPosition = `${Math.ceil(
        this.convertPttoPx(strokeWidth) / 2
      )}px`;

      const shadowDisplay = dropShadow ? 'block' : 'none';
      const shadowTransform = `translate(${shadowOffsetX}px, ${shadowOffsetY}px)`;
      const shadowFilter = `blur(${shadowBlur}px)`;

      const cssVariable = {
        '--border-color': borderColor,
        '--border-width': borderWidth,
        '--border-style': borderStyle,
        '--shadow-filter': shadowFilter,
        '--shadow-transform': shadowTransform,
        '--shadow-color': shadowColor,
        '--shadow-display': shadowDisplay,
        '--double-border-display': doubleBorderDisplay,
        '--double-border-position': doubleBorderPosition,
        '--double-border-width': doubleBorderWidth,
        '--image-height': imageHeight,
        '--border-radius': borderRadius,
        '--ratio': parseFloat(imageHeight) / 100
      };

      return {
        ...cssVariable
      };
    },
    portraitItems() {
      return this.portraits.map(p => {
        return {
          ...p,
          isLargePortrait: this.isLargePortrait(p)
        };
      });
    },
    title() {
      return this.flowSettings.textSettings?.pageTitle;
    },
    backgroundCssStyle() {
      const { imageUrl, opacity } = this.background;
      const color = `rgba(255,255,255, ${1 - opacity})`;

      if (!imageUrl) return {};

      return {
        backgroundImage: `linear-gradient(${color},${color}), url(${imageUrl})`
      };
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
            this.updatePortraitData();
          });
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.previewHeight = this.$refs.thumbWrapper?.clientHeight;
      this.updatePortraitData();
    });
  },
  methods: {
    /**
     * Update portrait data
     */
    updatePortraitData() {
      // order of function calls is matter
      this.$nextTick(() => {
        this.setThumbWrapperHeight();
        this.updateMargins();
        this.updateLayout();
        this.setNamesHeight();
        this.updateLargePortraitSize();
      });
    },

    /**
     * To calculate width portrait and update layout on UI
     */
    updateLayout() {
      const portraitsEl = this.$refs.portraitsSection?.$refs.portraits;
      const thumbWrapperEl = this.$refs.thumbWrapper;

      if (!portraitsEl?.style) return;

      const row = this.layout.rowCount;
      const col = this.layout.colCount;

      const styles = window.getComputedStyle(thumbWrapperEl);

      const containerHeight =
        thumbWrapperEl?.clientHeight -
        parseFloat(styles.paddingTop) -
        parseFloat(styles.paddingBottom);

      const containerWidth =
        thumbWrapperEl.clientWidth -
        parseFloat(styles.paddingLeft) -
        parseFloat(styles.paddingRight);

      const width =
        parseInt(containerWidth) / (col + (col - 1) * this.defaultGap);
      const height =
        parseInt(containerHeight) / (row + (row - 1) * this.defaultGap);

      this.portraitWidth = Math.min(
        width,
        (height - this.lineHeight) / this.defaultRatio
      );

      this.portraitWidth = Math.max(this.portraitWidth, 0);

      portraitsEl.style.setProperty('--row-count', this.layout.rowCount);
      portraitsEl.style.setProperty('--col-count', this.layout.colCount);
      portraitsEl.style.setProperty(
        '--name-height',
        Math.round(this.lineHeight) + 'px'
      );

      portraitsEl.style.setProperty(
        '--portrait-width',
        Math.round(this.portraitWidth) + 'px'
      );

      if (row === 1 && col === 1) {
        const align = !this.isCenterPosition ? '' : 'center';
        portraitsEl.style.setProperty('--align', align);
        return;
      }

      portraitsEl.style.setProperty('--align', 'space-between');
    },

    /**
     * To update margin based on layout settings
     */
    updateMargins() {
      const thumbWrapperEl = this.$refs.thumbWrapper;
      if (!thumbWrapperEl?.style) return;

      const margins = this.layout.margins;
      const nameWidth = this.flowSettings.textSettings?.nameWidth;

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
      const nameContainerHeight = this.$refs.portraitsSection?.$el.clientHeight;
      const portraitHeight = this.portraitWidth * this.defaultRatio;

      const gap = (nameContainerHeight - portraitHeight * row) / (row - 1);

      this.namesHeight = { height: `${portraitHeight + gap}px` };
    },
    /**
     * Set height for thumbnail wrapper container when has page title
     */
    setThumbWrapperHeight() {
      const thumbWrapper = this.$refs.thumbWrapper;
      const { lineHeight, paddingBottom, paddingTop } = this.pageTitleStyle;
      const pageTitleHeight =
        parseFloat(lineHeight) +
        parseFloat(paddingBottom) +
        parseFloat(paddingTop);
      const height = this.showPageTitile ? pageTitleHeight : 0;

      if (thumbWrapper) thumbWrapper.style.height = `calc(100% - ${height}px)`;
    },
    /**
     * Convert value from in to px
     */
    convertIntoPx(value) {
      return inToPxPreview(value, this.previewHeight, this.isDigital);
    },
    /**
     * Convert value from pt to px
     */
    convertPttoPx(value) {
      return ptToPxPreview(value, this.previewHeight, this.isDigital);
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
      const portraitsEl = this.$refs.portraitsSection?.$refs.portraits;
      const largeEl = portraitsEl?.querySelector('.enlarge');

      if (!largeEl) return;
      const rawWidth = largeEl.clientWidth;
      const rawHeight = largeEl.clientHeight;

      const width = parseFloat(rawWidth);
      const height = parseFloat(rawHeight);

      if (!width || !height) return;

      const calcImageWidth = (height - this.lineHeight) / this.defaultRatio;
      const enlargeWidth = Math.min(width, calcImageWidth) + 'px';

      portraitsEl.style.setProperty('--enlarge-width', enlargeWidth);
    },
    /**
     *  Calculate portrait name if large portraits on first
     */
    calcPortraitNameForLargOnFirst(
      portraitArray,
      numLargePortrait,
      isOneLine,
      lastRowCount
    ) {
      const portraitNameArray = [];

      const { flowSingleSettings, startOnPageNumber } = this.flowSettings;

      const pages = this.isDigital
        ? Object.values(flowSingleSettings.screen)[0]
        : flowSingleSettings.pages;

      const { rowCount, colCount } = this.layout;

      const isOnStartPage = this.pageNumber === startOnPageNumber;
      const isOnLastPage = this.pageNumber === pages[pages.length - 1];

      if (isOnStartPage) {
        for (let i = 1; i <= rowCount; i++) {
          const numPortraitForRow =
            i < 3 ? colCount - numLargePortrait * i : colCount;

          portraitNameArray.push(portraitArray.splice(0, numPortraitForRow));
        }

        return portraitNameArray;
      }

      if (
        !isOnLastPage ||
        isOneLine ||
        (lastRowCount === 1 && numLargePortrait < 2)
      ) {
        while (portraitArray.length) {
          portraitNameArray.push(portraitArray.splice(0, colCount));
        }
        return portraitNameArray;
      }
    }
  }
};
