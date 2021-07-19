import { mapGetters } from 'vuex';

import Item from './Item';
import { ACTIONS } from '@/common/constants';
import { GETTERS } from '@/store/modules/app/const';
import { isEmpty, parsePasteObject } from '@/common/utils';
import { COPY_OBJECT_KEY } from '@/common/constants/config';
import { EVENT_TYPE } from '@/common/constants/eventType';

export default {
  components: {
    Item
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
      hasActiveObjects: GETTERS.HAS_ACTIVE_OBJECTS
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
    }
  },
  mounted() {
    this.setEnableCopy();
    this.setEnablePaste();
  },
  methods: {
    /**
     * Check whether copy text enabled base on user has select object(s) or not
     */
    setEnableCopy() {
      this.items[0].disabled = !this.hasActiveObjects;
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
    }
  }
};
