import { LINK_STATUS, SHEET_TYPE } from '@/common/constants';

export default {
  props: {
    numberPage: {
      type: Object,
      default: () => ({})
    },
    isEditIconDisplayed: {
      type: Boolean,
      default: true
    },
    isLinkIconDisplayed: {
      type: Boolean,
      default: true
    },
    toLink: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isSidebar: {
      type: Boolean,
      default: false
    },
    sheetType: {
      type: [String, Number],
      default: SHEET_TYPE.NORMAL
    },
    linkType: {
      type: String,
      default: LINK_STATUS.NONE
    },
    thumbnailUrl: {
      type: String
    },
    isEnable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    pageDisplayCssClass() {
      return this.isSidebar ? 'sidebar' : '';
    },
    thumnailCssClass() {
      return [this.getHalfSheetCssClass(), this.isActive && 'active'];
    },
    isLinkDisplayed() {
      return this.isLinkIconDisplayed && this.linkType !== LINK_STATUS.NONE;
    },
    linkData() {
      return this.getLinkData();
    }
  },
  methods: {
    /**
     * Emit event change link status
     */
    changeLinkStatus() {
      this.$emit('change');
    },
    /**
     * Get icon & css class if link is displayed
     */
    getLinkData() {
      if (!this.isLinkDisplayed) return {};

      return {
        icon: this.linkType === LINK_STATUS.LINK ? 'link' : 'link_off',
        cssClass: this.linkType === LINK_STATUS.LINK ? '' : 'unlink'
      };
    },
    /**
     * Get css class if current sheet is half sheet
     */
    getHalfSheetCssClass() {
      if (this.sheetType === SHEET_TYPE.FRONT_COVER) return 'half-right';

      if (this.sheetType === SHEET_TYPE.BACK_COVER) return 'half-left';

      return '';
    }
  }
};
