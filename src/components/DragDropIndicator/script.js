export default {
  props: {
    id: {
      type: String
    },
    customClassName: {
      type: String
    }
  },
  mounted: function() {
    this.$root.$on('showIndicator', id => {
      if (id !== this.id) {
        return;
      }

      this.$el.classList.remove('hide');
    });

    this.$root.$on('hideIndicator', () => {
      this.$el.classList.add('hide');
    });
  }
};
