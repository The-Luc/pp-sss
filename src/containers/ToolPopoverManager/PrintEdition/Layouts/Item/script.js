export default {
  props: {
    layout: {
      type: Object,
      default: () => ({})
    },
    selectedLayoutId: {
      type: Number,
      default: 0
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    isDigital: {
      type: Boolean,
      default: false
    },
    isFavorites: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    favoriteData() {
      return {
        iconName: this.isFavorites ? 'favorite' : 'favorite_border',
        cssClass: this.isFavorites ? 'favorites' : ''
      };
    }
  },
  methods: {
    /**
     * Emit layout selected to parent
     */
    onClick() {
      this.$emit('click', this.layout);
    },
    /**
     * Emit layout favorite to parent
     */
    onSaveToFavorites(event) {
      event.stopPropagation();

      this.$emit('saveToFavorites', {
        id: this.layout.id,
        isFavorites: !this.isFavorites
      });
    }
  }
};
