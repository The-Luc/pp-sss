export default {
  props: {
    position: {
      type: Number,
      required: true
    },
    isShort: {
      type: Boolean,
      default: false
    },
    eventDate: {
      type: String
    },
    description: {
      type: String
    }
  },
  methods: {
    /**
     * Get left value base on position
     *
     * @returns {String}
     */
    getPosition: function() {
      if (this.position > 1) return `${this.position}px`;

      return this.position === 1
        ? 'calc(100% - 6px)'
        : `${this.position * 100}%`;
    }
  }
};
