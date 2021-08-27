import Header from './Header';
import Footer from './Footer';

import { mapMutations } from 'vuex';

import { MUTATES } from '@/store/modules/app/const';

import { KEY_CODE } from '@/common/constants';
import { isEmpty } from '@/common/utils';

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
    }
  },
  computed: {
    //
  },
  data() {
    return {
      isDefaulHeaderDisplayed: this.isShowHeader && isEmpty(this.$slots.header),
      isDefaulFooterDisplayed:
        this.isFooterDisplayed && isEmpty(this.$slots.footer)
    };
  },
  mounted() {
    //
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
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
