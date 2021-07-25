import { LINK_STATUS } from '@/common/constants';
import { isEmpty } from '@/common/utils';

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
    customCssClass: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isLinkDisplayed: false,
      isMiddleNameDisplayed: false
    };
  },
  computed: {
    linkData() {
      return this.getLinkData();
    }
  },
  mounted() {
    const isDigital = !isEmpty(this.pageNames.middle);

    this.isLinkDisplayed =
      !isDigital &&
      this.isLinkIconDisplayed &&
      this.linkType !== LINK_STATUS.NONE;

    this.isMiddleNameDisplayed = isDigital;
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
