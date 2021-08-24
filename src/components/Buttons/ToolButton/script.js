export default {
  props: {
    iconName: {
      type: String
    },
    isPrompt: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    customCssClass() {
      const activeCssClass = this.isActive ? 'item--active' : '';
      const promtCssClass =
        this.isActive && this.isPrompt ? 'item--prompt' : '';
      const disableCssClass = this.disabled ? 'disabled' : '';

      return [activeCssClass, promtCssClass, disableCssClass];
    }
  },
  methods: {
    onClick() {
      this.$emit('click');
    }
  }
};
