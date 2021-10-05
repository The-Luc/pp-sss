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
    pageNames: {
      type: Object,
      default: () => ({})
    },
    isActive: {
      type: Boolean,
      default: false
    },
    totalItem: {
      type: Number,
      default: 0
    },
    isEnable: {
      type: Boolean,
      default: false
    },
    isEditor: {
      type: Boolean,
      default: false
    },
    isDigital: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isOpenMenu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      displayCssClass: '',
      customCssClass: []
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
     * Emit event change link status
     */
    onUpdateLink() {
      this.$emit('updateLink');
    },
    /**
     * Select this sheet by emit to parent
     */
    onSelect() {
      this.$emit('select');
    },
    /**
     * Event fire when click more action
     * @param {Object} event fired event
     */
    toggleMenu(event) {
      this.$emit('toggleMenu', event);
    }
  }
};
