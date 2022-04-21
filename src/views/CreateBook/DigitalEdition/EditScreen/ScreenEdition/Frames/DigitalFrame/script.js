import ThreeDotMenuIcon from '@/components/Icon/ThreeDotMenuIcon';

export default {
  components: {
    ThreeDotMenuIcon
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    previewImageUrl: {
      type: String
    },
    isPackageLayout: {
      type: Boolean,
      default: true
    },
    activeId: {
      type: [Number, String],
      default: ''
    },
    dragTargetId: {
      type: [Number, String],
      default: ''
    },
    activeTransitionIndex: {
      type: Number,
      default: -1
    },
    isFrameMenuDisplayed: {
      type: Boolean,
      default: false
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    isScrollable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isMenuIconDisplayed: false
    };
  },
  computed: {
    isActived() {
      return this.id === this.activeId;
    },
    isTransitionActived() {
      return this.index - 1 === this.activeTransitionIndex;
    },
    isTargeted() {
      return this.id === this.dragTargetId;
    },
    canMenuIconDisplayed() {
      return (
        this.isActived && !this.isPackageLayout && !this.isFrameMenuDisplayed
      );
    }
  },
  methods: {
    /**
     * Emit click event on frame to parent
     *
     * @param {Object} event mouse event parameter when click element
     */
    onFrameClick(event) {
      this.$emit('click', { event, id: this.id });
    },
    /**
     * Emit click event on transition icon to parent
     *
     * @param {Object} event mouse event parameter when click element
     */
    onTransitionIconClick(event) {
      event.stopPropagation();

      this.$emit('toggleTransition', {
        event,
        target: event.target,
        index: this.index - 1
      });
    },
    /**
     * Emit click event on menu icon to parent
     *
     * @param {Object} event mouse event
     */
    onMenuIconClick({ event }) {
      this.$emit('toggleMenu', { event });
    }
  }
};
