import { mapGetters } from 'vuex';

import Item from './Item';
import { GETTERS } from '@/store/modules/app/const';
import { isEmpty, parsePasteObject } from '@/common/utils';
import {
  ACTIONS,
  EVENT_TYPE,
  OBJECT_TYPE,
  MODAL_TYPES,
  ROLE
} from '@/common/constants';
import { COPY_OBJECT_KEY } from '@/common/constants/config';
import { useTotalObjects, useModal, useToolBar, useUser } from '@/hooks';

export default {
  components: {
    Item
  },
  props: {
    isDigital: {
      type: Boolean,
      default: false
    }
  },
  setup({ isDigital }) {
    const { totalBackground, totalObject } = useTotalObjects(isDigital);
    const { currentUser } = useUser();

    const { toggleModal } = useModal();
    const { setToolNameSelected } = useToolBar();
    return {
      totalBackground,
      totalObject,
      toggleModal,
      setToolNameSelected,
      currentUser
    };
  },
  data() {
    const items = [
      { name: 'Copy Selected Item', value: ACTIONS.COPY, disabled: true },
      { name: 'Paste Copied Item', value: ACTIONS.PASTE, disabled: true },
      { name: 'Save Layout', value: ACTIONS.SAVE_LAYOUT, disabled: true },
      { name: 'Save Style', value: ACTIONS.SAVE_STYLE, disabled: true },
      { name: 'Map a Layout', value: ACTIONS.MAP_LAYOUT, disabled: false },
      { name: 'Generate PDF', value: ACTIONS.GENERATE_PDF, disabled: true }
    ];
    if (this.isDigital) items.pop();

    return { items };
  },
  computed: {
    ...mapGetters({
      toolNameSelected: GETTERS.SELECTED_TOOL_NAME,
      hasActiveObjects: GETTERS.HAS_ACTIVE_OBJECTS,
      currentObject: GETTERS.CURRENT_OBJECT
    }),
    activeOjectsValue() {
      return this.hasActiveObjects;
    }
  },
  watch: {
    toolNameSelected(val) {
      if (val) {
        this.setEnableCopy();
        this.setEnablePaste();
      }
    },
    activeOjectsValue() {
      this.setEnableCopy();
    },
    totalBackground: {
      deep: true,
      handler() {
        this.setEnableSaveLayout();
      }
    },
    totalObject: {
      deep: true,
      handler() {
        this.setEnableSaveLayout();
      }
    },
    currentObject() {
      this.setEnableSaveStyle();
    }
  },
  mounted() {
    this.setEnableCopy();
    this.setEnablePaste();
    this.setEnableSaveLayout();
    this.setEnableSaveStyle();
    this.setEnableGeneratePdf();
  },
  methods: {
    /**
     * Check whether copy text enabled base on user has select object(s) or not
     */
    setEnableCopy() {
      this.items[0].disabled = !this.hasActiveObjects;
    },
    /**
     * Check whether save layout enabled base on user has object(s) or not
     */
    setEnableSaveLayout() {
      this.items[2].disabled = !this.totalObject && !this.totalBackground;
    },
    /**
     * Check whether generate pdf enabled base on user role
     */
    setEnableGeneratePdf() {
      if (this.isDigital) return;
      this.items[4].disabled = this.currentUser.role !== ROLE.ADMIN;
    },
    /**
     * Callback function to get action value when user click on and emit to parent
     */
    onClick(actionValue) {
      if (actionValue === ACTIONS.COPY) {
        this.items[1].disabled = false;
        this.$root.$emit(EVENT_TYPE.COPY_OBJ);
      }

      if (actionValue === ACTIONS.PASTE) {
        this.$root.$emit(EVENT_TYPE.PASTE_OBJ);
      }

      if (actionValue === ACTIONS.SAVE_LAYOUT) {
        const modalType = this.isDigital
          ? MODAL_TYPES.SAVE_DIGITAL_LAYOUT
          : MODAL_TYPES.SELECT_PAGE_OF_LAYOUT;

        this.toggleModal({
          isOpenModal: true,
          modalData: {
            type: modalType
          }
        });
      }
      if (actionValue === ACTIONS.SAVE_STYLE) {
        this.$root.$emit(EVENT_TYPE.SAVE_STYLE);
      }
      if (actionValue === ACTIONS.GENERATE_PDF) {
        this.$root.$emit(EVENT_TYPE.GENERATE_PDF);
      }

      if (actionValue === ACTIONS.MAP_LAYOUT) {
        this.toggleModal({
          isOpenModal: true,
          modalData: {
            type: MODAL_TYPES.MAP_LAYOUT
          }
        });
      }

      this.setToolNameSelected({
        name: ''
      });
    },
    /**
     * Function to get object(s) copied and validate data to enabled paste label
     */
    setEnablePaste() {
      const items = sessionStorage.getItem(COPY_OBJECT_KEY);
      if (!items) {
        this.items[1].disabled = true;
        return;
      }
      const objects = parsePasteObject(items);
      this.items[1].disabled = isEmpty(objects);
    },

    /**
     * Check whether save text/image style enabled base on user has select object or not
     */
    setEnableSaveStyle() {
      if (
        [OBJECT_TYPE.TEXT, OBJECT_TYPE.IMAGE].includes(this.currentObject?.type)
      ) {
        this.items[3].disabled = false;
        return;
      }
      this.items[3].disabled = true;
    }
  }
};
