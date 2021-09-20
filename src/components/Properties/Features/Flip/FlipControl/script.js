import ButtonProperty from '@/components/Buttons/ButtonProperty';

export default {
  components: {
    ButtonProperty
  },
  props: {
    isHorizontal: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: this.isHorizontal ? 'Horizontal' : 'Vertical'
    };
  },
  methods: {
    /**
     * Emit click to parent
     */
    onClick() {
      this.$emit('click');
    }
  }
};
