import { LINK_STATUS } from '@/common/constants';

export default {
  props: {
    pageNames: {
      type: Object,
      default: () => ({})
    },
    linkType: {
      type: String,
      default: LINK_STATUS.NONE
    },
    isLinkIconDisplayed: {
      type: Boolean,
      default: true
    },
    isEditor: {
      type: Boolean,
      default: false
    },
    isDigital: {
      type: Boolean,
      default: false
    },
    customCssClass: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isLinkDisplayed: false,
      isMiddleNameDisplayed: false,
      pageLeftName: this.pageNames.left,
      pageRightName: this.pageNames.right
    };
  },
  computed: {
    linkData() {
      return this.getLinkData();
    }
  },
  mounted() {
    this.isLinkDisplayed =
      !this.isDigital &&
      this.isLinkIconDisplayed &&
      this.linkType !== LINK_STATUS.NONE;

    this.isMiddleNameDisplayed = this.isDigital && !this.isEditor;
  },
  methods: {
    /**
     * Emit event change link status
     */
    changeLinkStatus() {
      this.$emit('updateLink');
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
    }
  }
};
