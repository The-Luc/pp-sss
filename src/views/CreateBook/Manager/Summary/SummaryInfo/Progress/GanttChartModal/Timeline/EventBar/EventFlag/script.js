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
     * getPosition - Get css left value base on position
     *
     * @returns {String}  the css value
     */
    getPosition: function() {
      if (this.position > 1) return `${this.position}px`;

      return this.position === 1
        ? 'calc(100% - 6px)'
        : `${this.position * 100}%`;
    }
  }
};
