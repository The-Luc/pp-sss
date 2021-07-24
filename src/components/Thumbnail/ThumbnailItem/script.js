import Header from '../ThumbnailHeader';
import Content from './ThumbnailContent';
import Footer from './ThumbnailFooter';

import { LINK_STATUS, SHEET_TYPE } from '@/common/constants';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    Header,
    Content,
    Footer
  },
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
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
    toLink: {
      type: String,
      default: ''
    },
    orderedNumber: {
      type: Object,
      default: () => ({})
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isEnable: {
      type: Boolean,
      default: false
    },
    totalItem: {
      type: Number,
      default: 0
    },
    isEditor: {
      type: Boolean,
      default: false
    },
    isDigital: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      displayCssClass: '',
      customCssClass: [],
      isContentDisplayed: true
    };
  },
  mounted() {
    if (!this.isEditor) this.displayCssClass = 'col-3';

    const editorCssClass = this.isEditor ? 'editor' : '';
    const digitalCssClass = this.isDigital ? 'digital' : '';
    const disabledCssClass = this.isEnable ? '' : 'disabled';

    this.customCssClass = [
      editorCssClass,
      digitalCssClass,
      disabledCssClass
    ].filter(c => !isEmpty(c));
  },
  methods: {
    /**
     * Toggle display content
     */
    onToggleContent() {
      if (!this.isToggleContentAvailable) return;

      this.isContentDisplayed = !this.isContentDisplayed;
    },
    /**
     * Emit event change link status
     */
    onUpdateLink() {
      this.$emit('updateLink');
    }
  }
};
