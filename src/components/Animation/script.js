import Control from './Control';

export default {
  components: {
    Control
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    onPreview(config) {
      console.log('preview', config);
    }
  }
};
