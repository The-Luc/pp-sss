import PpToolPopover from '@/components/ToolPopover';

import Item from './Item';

import { mapGetters, mapMutations } from 'vuex';

import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';

import {
  TOOL_NAME
} from '@/common/constants';

import { usePopoverCreationTool } from '@/hooks';

import { cloneDeep } from 'lodash';
import { isEmpty } from '@/common/utils';

export default {
  components: {
    PpToolPopover,
    Item
  },
  data() {
    return {
      chosenShapes: [],
      noShapeLength: 12
    };
  },
  setup() {
    const { setToolNameSelected, selectedToolName } = usePopoverCreationTool();

    return {
      selectedToolName,
      setToolNameSelected
    };
  },
  computed: {
    ...mapGetters({
      book: BOOK_GETTERS.BOOK_DETAIL,
      sectionId: BOOK_GETTERS.SECTION_ID,
      currentSheet: BOOK_GETTERS.GET_PAGE_SELECTED
    }),
    selectedShapes() {
      return this.chosenShapes;
    },
    shapes() {
      return [];
    }
  },
  watch: {
    selectedToolName(val) {
      if (val && val === TOOL_NAME.SHAPES) {
        this.initData();
      }
    },
    currentSheet: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.id !== oldVal.id) {
          this.initData();
        }
      }
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapMutations({
      toggleModal: APP_MUTATES.TOGGLE_MODAL
    }),
    /**
     * Set up inital data to render in view
     */
    initData() {
      this.chosenShapes = {};
    },
    onSelectShape(data) {
      this.chosenShapes = data;
    },
    /**
     * Trigger hooks to set tool name is empty and then close popover when click Cancel button
     */
    onClose() {
      this.setToolNameSelected('');
    },
    /**
     * Trigger mutation to add shapes
     */
    applyChosenShapes() {
      this.onClose();
    }
  }
};
