export default {
  props: {
    layouts: {
      type: Array,
      require: true
    },
    themeName: {
      type: String,
      default: 'Confetti'
    }
  },
  methods: {},
  created() {
    console.log(this.layouts);
  }
};
