import Draggable from 'vuedraggable';

import EmptyFrame from './EmptyFrame';
import FrameMenu from './FrameMenu';

import { useFrameOrdering, useFrame, useFrameAction, useModal } from '@/hooks';

import { isEmpty } from '@/common/utils';
import { MODAL_TYPES } from '@/common/constants';

export default {
  components: {
    EmptyFrame,
    FrameMenu,
    Draggable
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
      isOpenMenu: false,
      menuX: 0,
      menuY: 0,
      drag: false,
      selectedIndex: -1,
      moveToIndex: -1,
      dragSelectedId: null
    };
  },
  setup() {
    const { toggleModal } = useModal();
    const { moveFrame } = useFrameOrdering();
    const { setCurrentFrameId } = useFrame();
    const {
      handleAddFrame,
      handleDeleteFrame,
      handleReplaceFrame,
      handleChangeFrame
    } = useFrameAction();

    return {
      toggleModal,
      moveFrame,
      handleAddFrame,
      handleDeleteFrame,
      handleChangeFrame,
      handleReplaceFrame,
      setCurrentFrameId
    };
  },
  computed: {
    frameList() {
      const defaultData = [
        {
          id: 0,
          frame: {
            image: '',
            type: null,
            id: 0,
            fromLayout: true
          }
        }
      ];
      // if there are no frame => render default one
      if (isEmpty(this.frames)) return defaultData;

      // if there are only supplemental frames => render a blank frame at 1st position
      const hasTrueFrame = this.frames.some(f => f.frame.fromLayout);
      if (!hasTrueFrame) return [...defaultData, ...this.frames];

      return this.frames;
    }
  },
  methods: {
    /**
     * Fire when click on delete option of a frame
     * @param {Number} id Id of the active frame which will be deleted
     */
    onDeleteFrame() {
      this.handleDeleteFrame(this.activeFrameId);
      this.onCloseMenu();
    },

    /**
     * Fire when click on an frame
     * @param {Number} id Id of the clicked frame
     */
    onFrameClick(id) {
      if (id === this.currentFrameId) return;

      this.setCurrentFrameId({ id });
    },
    /**
     * Fire when click add frame button
     * @param {Element} target add frame button
     */
    addFrame({ target }) {
      const { left, width } = target.getBoundingClientRect();
      const centerX = left + width / 2;
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.ADD_DIGITAL_FRAME,
          props: {
            centerX
          }
        }
      });
    },
    /**
     * Fire when click add replace button
     * @param {Element} target add frame button
     */
    onReplaceLayout() {
      const target = this.$refs[`frame-${this.activeFrameId}`][0];

      const { left, width } = target.getBoundingClientRect();
      const centerX = left + width / 2;

      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.ADD_DIGITAL_FRAME,
          props: {
            centerX,
            layoutId: this.activeFrameId
          }
        }
      });

      this.onCloseMenu();
    },

    /**
     * To toggle the option menu of a frame
     */
    onOptionClick(event) {
      this.isOpenMenu = true;

      const element = event.target;
      const { x, y } = element.getBoundingClientRect();
      this.menuX = x - 195;
      this.menuY = y - 205;
    },

    /**
     * Close Menu popup
     */
    onCloseMenu() {
      this.isOpenMenu = false;
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
      this.dragSelectedId = null;

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

      this.dragSelectedId = relateFrame?.id;

      return false;
    },
    /**
     * Fire when drop a frame
     *
     * @param {Object} event fired event
     */
    onEnd() {
      this.dragSelectedId = null;

      if (this.selectedIndex < 0 || this.moveToIndex < 0) {
        return;
      }

      this.moveFrame({
        moveToIndex: this.moveToIndex,
        selectedIndex: this.selectedIndex
      });

      this.$emit('moveFrame', {
        moveToIndex: this.moveToIndex,
        selectedIndex: this.selectedIndex
      });

      this.selectedIndex = -1;
      this.moveToIndex = -1;
    }
  }
};
