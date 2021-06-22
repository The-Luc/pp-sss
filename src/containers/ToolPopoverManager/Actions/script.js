import { mapGetters } from 'vuex';

import Item from './Item';
import { ACTIONS } from '@/common/constants';
import { GETTERS } from '@/store/modules/app/const';
import { isFabricObject, isJsonString } from '@/common/utils';

export default {
  components: {
    Item
  },
  data() {
    return {
      items: [
        { name: 'Copy Selected Item', value: ACTIONS.COPY, disabled: true },
        { name: 'Paste Copied Item', value: ACTIONS.PASTEE, disabled: true },
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
        this.$root.$emit('printCopyObj');
      }
    },
    /**
     * Async function to get object(s) copied and validate data to enabled paste label
     */
    async setEnablePaste() {
      const items = await navigator.clipboard.readText();
      const isJson = isJsonString(items);
      if (isJson) {
        const isValid = isFabricObject(items);
        this.items[1].disabled = !isValid;
      } else {
        this.items[1].disabled = true;
      }
    }
  }
};
