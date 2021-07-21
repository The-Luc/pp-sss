import { mapGetters, mapMutations } from 'vuex';

import Item from './Item';
import { GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { isEmpty, parsePasteObject } from '@/common/utils';
import { MODAL_TYPES } from '@/common/constants';
import { ACTIONS, EVENT_TYPE, OBJECT_TYPE } from '@/common/constants';
import {
  COPY_OBJECT_KEY,
  MAX_SAVED_TEXT_STYLES
} from '@/common/constants/config';
import { useTextStyle } from '@/hooks/style';

export default {
  components: {
    Item
  },
  setup() {
    const { savedTextStyles } = useTextStyle();
    return { savedTextStyles };
  },
  data() {
    return {
      items: [
        { name: 'Copy Selected Item', value: ACTIONS.COPY, disabled: true },
        { name: 'Paste Copied Item', value: ACTIONS.PASTE, disabled: true },
        { name: 'Save Layout', value: ACTIONS.SAVE_LAYOUT, disabled: true },
        { name: 'Save Style', value: ACTIONS.SAVE_STYLE, disabled: true },
        { name: 'Generate PDF', value: ACTIONS.GENERATE_PDF, disabled: true }
      ]
    };
  },
  computed: {
    ...mapGetters({
      toolNameSelected: GETTERS.SELECTED_TOOL_NAME,
      hasActiveObjects: GETTERS.HAS_ACTIVE_OBJECTS,
      totalBackground: PRINT_GETTERS.TOTAL_BACKGROUND,
      totalObject: PRINT_GETTERS.TOTAL_OBJECT,
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
    },
    savedTextStyles() {
      this.setEnableSaveStyle();
    }
  },
  mounted() {
    this.setEnableCopy();
    this.setEnablePaste();
    this.setEnableSaveLayout();
    this.setEnableSaveStyle();
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
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
        this.toggleModal({
          isOpenModal: true,
          modalData: {
            type: MODAL_TYPES.SELECT_PAGE_OF_LAYOUT
          }
        });
      }
      if (actionValue === ACTIONS.SAVE_STYLE) {
        this.$root.$emit(EVENT_TYPE.SAVE_STYLE);
      }
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
        [OBJECT_TYPE.TEXT, OBJECT_TYPE.IMAGE].includes(
          this.currentObject?.type
        ) &&
        this.savedTextStyles?.length < MAX_SAVED_TEXT_STYLES
      ) {
        this.items[3].disabled = false;
        return;
      }
      this.items[3].disabled = true;
    }
  }
};
