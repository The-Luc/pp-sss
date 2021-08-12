export default {
  props: {
    showAutoflow: {
      type: Boolean,
      default: true
    },
    typeName: {
      type: String,
      default: 'Photos'
    }
  },
  methods: {
    /**
     * Trigger emit event when click close icon
     */
    onClick() {
      this.$emit('click');
    },
    /**
     * Trigger emit event when user click on add photos button
     */
    addPhoto() {
      this.$emit('addPhoto');
    },
    /**
     * Trigger emit event when click autoflow
     */
    autoflow() {
      this.$emit('autoflow');
    }
  }
};
