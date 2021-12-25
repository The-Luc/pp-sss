import Draggable from 'vuedraggable';

import DigitalFrame from './DigitalFrame';
import FrameMenu from './FrameMenu';
import TransitionProperties from './TransitionProperties';

import {
  useFrameOrdering,
  useFrame,
  useFrameAdd,
  useModal,
  useToolBar,
  useSheet
} from '@/hooks';

import { MODAL_TYPES } from '@/common/constants';
import { autoScroll, getRefElement, isEmpty } from '@/common/utils';

export default {
  components: {
    DigitalFrame,
    FrameMenu,
    Draggable,
    TransitionProperties
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
  setup() {
    const { toggleModal } = useModal();
    const { handleUpdateFrameOrder } = useFrameOrdering();
    const { setCurrentFrameId } = useFrame();
    const { currentSheet } = useSheet();
    const { handleAddFrame } = useFrameAdd();
    const { setPropertiesType } = useToolBar();

    return {
      toggleModal,
      handleUpdateFrameOrder,
      handleAddFrame,
      setCurrentFrameId,
      currentSheet,
      setPropertiesType
    };
  },
  data() {
    return {
      isOpenMenu: false,
      menuX: 0,
      menuY: 0,
      drag: false,
      selectedIndex: -1,
      moveToIndex: -1,
      dragTargetId: null,
      transitionIndex: -1,
      transitionX: 0,
      transitionY: 0,
      isScrollable: false
    };
  },
  watch: {
    activeFrameId(newValue, oldValue) {
      if (newValue === oldValue) return;

      autoScroll(this.$refs, `frame-${newValue}`);

      setTimeout(() => {
        const element = getRefElement(this.$refs, 'frames');

        if (isEmpty(element)) return;

        this.isScrollable = element.scrollWidth > element.offsetWidth;
      }, 20);
    }
  },
  methods: {
    /**
     * Fire when click on delete option of a frame
     * @param {Number} id Id of the active frame which will be deleted
     */
    onDeleteFrame() {
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.DELETE_FRAME,
          props: {
            id: this.activeFrameId
          }
        }
      });
      this.onCloseMenu();
    },

    /**
     * Fire when click on an frame
     * @param {Number} id Id of the clicked frame
     */
    onFrameClick({ id }) {
      if (id === this.activeFrameId) return;

      this.setCurrentFrameId({ id });
    },
    /**
     * Fire when click add frame button
     * @param {Element} target add frame button
     */
    onAddFrame({ event: { target } }) {
      this.setPropertiesType({ type: '' });

      const { left, width } = target.getBoundingClientRect();
      const centerX = left + width / 2;
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.ADD_DIGITAL_FRAME,
          props: {
            centerX,
            isAddFrame: true
          }
        }
      });
    },
    /**
     * Fire when click add replace button
     * @param {Element} target add frame button
     */
    onReplaceLayout() {
      const target = getRefElement(this.$refs, `frame-${this.activeFrameId}`);

      if (isEmpty(target)) return;

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
     *
     * @param {Object} event fired event
     */
    onOptionClick({ event }) {
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
      this.closeTransitionMenu();

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

      this.drag = false;

      if (this.selectedIndex < 0 || this.moveToIndex < 0) {
        return;
      }

      this.handleUpdateFrameOrder(
        {
          moveToIndex: this.moveToIndex,
          selectedIndex: this.selectedIndex
        },
        this.currentSheet.id
      );

      const selectedIndex = this.moveToIndex;

      this.selectedIndex = -1;
      this.moveToIndex = -1;

      setTimeout(() => {
        this.$emit('onFrameClick', this.frames[selectedIndex]?.id);
      }, 20);
    },
    /**
     * Fire when click on transition icon
     *
     * @param {Object}  target the target
     * @param {Number}  index current index of transition
     */
    toggleTransitionPopup({ event, target, index }) {
      event.stopPropagation();

      if (this.transitionIndex === index) {
        this.transitionIndex = -1;

        return;
      }

      const element = target.className.includes('transition')
        ? target
        : target.parentElement;

      const { x, y } = element.getBoundingClientRect();

      const iconWidth = 20;

      setTimeout(() => {
        // 160: half width of modal
        this.transitionX = x - 160 + iconWidth / 2;

        // 116 is height of modal, 3 is space between modal & icon
        this.transitionY = y - 116 - iconWidth / 2 + 3;

        this.transitionIndex = index;
      }, 20);
    },
    /**
     * Close transition menu
     */
    closeTransitionMenu() {
      this.transitionIndex = -1;
    }
  }
};
