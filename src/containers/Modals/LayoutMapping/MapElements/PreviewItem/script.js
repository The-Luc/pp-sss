export default {
  components: {},
  props: {
    images: {
      type: Array,
      default: () => []
    },
    isDigital: {
      type: Boolean,
      default: false
    },
    isSingleLayout: {
      type: Boolean,
      default: false
    },
    idOfActiveImage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    onChangeActiveImage(id) {
      this.$emit('change', id);
    }
  }
};
