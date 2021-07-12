import Draggable from 'vuedraggable';

import EmptyFrame from './EmptyFrame';

import { useFrameOrdering } from '@/hooks';

export default {
  components: {
    Draggable,
    EmptyFrame
  },
  props: {
    frames: {
      type: Array
    },
    activeFrameId: {
      type: [String, Number]
    },
    showAddFrame: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      drag: false,
      selectedIndex: -1,
      moveToIndex: -1,
      dragTargetId: null
    };
  },
  setup() {
    const { moveFrame } = useFrameOrdering();

    return { moveFrame };
  },
  computed: {
    frameList() {
      const defaultData = [
        {
          id: 0,
          frame: {
            image: '',
            type: null,
            id: 0
          }
        }
      ];

      const hasPackageFrame = this.frames.some(item => item?.frame?.fromLayout);

      return hasPackageFrame ? this.frames : [...defaultData, ...this.frames];
    }
  },
  methods: {
    /**
     * Fire when click add frame button
     * @param {Object} event mouse event parameter when click element
     */
    addFrame(event) {
      this.$emit('addFrame', event);
    },
    /**
     * To emeit to parent component
     * @param {Number} id Id of the clicked frame
     */
    onFrameClick(id) {
      this.$emit('onFrameClick', id);
    },
    /**
     * Fire when choose a frame
     *
     * @param {Object} event fired event
     */
    onChoose(event) {
      this.moveToIndex = -1;

      this.selectedIndex = event.oldIndex;
    },
    /**
     * Fire when drag a frame
     *
     * @param {Object} event fired event
     */
    onMove(event) {
      this.dragTargetId = null;

      if (this.selectedIndex < 0) {
        return false;
      }

      if (event.related === null) {
        return false;
      }

      this.moveToIndex = event.draggedContext.futureIndex;

      if (this.moveToIndex === this.selectedIndex) {
        this.moveToIndex = -1;

        return false;
      }

      const relateFrame = event.relatedContext.element;

      this.dragTargetId = relateFrame?.id;

      return false;
    },
    /**
     * Fire when unchoose a frame
     */
    onUnchoose() {
      this.dragTargetId = null;
    },
    /**
     * Fire when drop a frame
     *
     * @param {Object} event fired event
     */
    onEnd() {
      this.dragTargetId = null;

      if (this.selectedIndex < 0 || this.moveToIndex < 0) {
        return;
      }

      this.moveFrame({
        moveToIndex: this.moveToIndex,
        selectedIndex: this.selectedIndex
      });

      const selectedIndex = this.moveToIndex;

      this.selectedIndex = -1;
      this.moveToIndex = -1;

      setTimeout(() => {
        this.$emit('onFrameClick', this.frameList[selectedIndex]?.id);
      }, 20);
    }
  }
};
