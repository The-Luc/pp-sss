export default {
  components: {},
  props: {
    keyWord: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      active: true
    };
  },
  methods: {
    onclick(keyWord) {
      this.active = !this.active;
      this.$emit('click', { keyWord, active: this.active });
    }
  }
};
