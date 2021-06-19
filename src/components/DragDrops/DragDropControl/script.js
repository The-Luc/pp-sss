export default {
  props: {
    id: String
  },
  mounted: function() {
    this.$root.$on('showDragControl', id => {
      if (id !== this.id) {
        return;
      }

      this.$el.classList.remove('invisible');
    });

    this.$root.$on('hideDragControl', () => {
      this.$el.classList.add('invisible');
    });
  }
};
