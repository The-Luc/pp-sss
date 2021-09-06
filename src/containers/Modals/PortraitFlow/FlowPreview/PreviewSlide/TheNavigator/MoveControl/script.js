export default {
  props: {
    isBackControl: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerCssClass: this.isBackControl ? 'inner-back' : 'inner-next',
      iconName: this.isBackControl ? 'chevron_left' : 'chevron_right'
    };
  },
  methods: {
    /**
     * Fire when click on control
     */
    onClick() {
      this.$emit('click');
    }
  }
};
