import InputTitle from '@/components/inputTitle';
export default {
  components: {
    InputTitle
  },
  props: {
    titleName: {
      type: String,
      default: 'Project Title:'
    },
    leftTitleValue: {
      type: String,
      default: ''
    },
    rightTitleValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isLink: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onChangeLeftTitle(val) {
      this.$emit('change', { leftTitle: val });
    },
    onChangeRightTitle(val) {
      this.$emit('change', { rightTitle: val });
    }
  }
};
