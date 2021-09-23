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
    isHeaderDisplayed: {
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
    isCloseIconDisplayed: {
      type: Boolean,
      default: true
    },
    isBackIconDisplayed: {
      type: Boolean,
      default: false
    },
    isAcceptButtonDisabled: {
      type: Boolean,
      default: true
    },
    isCancelButtonDisplayed: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isDefaulHeaderDisplayed:
        this.isHeaderDisplayed && isEmpty(this.$slots.header),
      isDefaulFooterDisplayed:
        this.isFooterDisplayed && isEmpty(this.$slots.footer)
    };
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
     * Emit back event
     */
    onBack() {
      this.$emit('back');
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
