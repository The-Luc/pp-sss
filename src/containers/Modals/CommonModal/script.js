import Header from './Header';
import Footer from './Footer';

import { isEmpty } from '@/common/utils';

import { KEY_CODE } from '@/common/constants';

export default {
  components: {
    Header,
    Footer
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    isOpenModal: {
      type: Boolean,
      default: false
    },
    isCloseIconDisplayed: {
      type: Boolean,
      default: true
    },
    isThemeUsed: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '500'
    },
    canCloseOutside: {
      type: Boolean,
      default: false
    },
    isShowHeader: {
      type: Boolean,
      default: true
    },
    isFooterDisplayed: {
      type: Boolean,
      default: true
    },
    container: {
      type: String
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    acceptText: {
      type: String,
      default: 'Ok'
    },
    isDisableAccept: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isDefaulHeaderDisplayed: this.isShowHeader && isEmpty(this.$slots.header),
      isDefaulFooterDisplayed:
        this.isFooterDisplayed && isEmpty(this.$slots.footer)
    };
  },
  mounted() {
    console.log('mounted'); // TODO: remove after finish
  },
  methods: {
    /**
     * Fire when user click outside modal
     */
    onClickOutside() {
      if (this.canCloseOutside) this.onCancel();
    },
    /**
     * Emit cancel event to parent
     */
    onCancel() {
      this.$emit('cancel');
    },
    /**
     * Fire when user click Escape and then call onClickOutside
     */
    onEscape(event) {
      const key = event.keyCode || event.charCode;

      if (key === KEY_CODE.ESCAPE) this.onClickOutside();
    },
    /**
     * Emit accept event to parent
     */
    onAccept() {
      this.$emit('accept');
    }
  }
};
