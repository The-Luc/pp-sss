import PpToolPopover from '@/components/ToolPopover';

import Item from './Item';

import { mapGetters, mapMutations } from 'vuex';

import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { GETTERS as BOOK_GETTERS } from '@/store/modules/book/const';

import { TOOL_NAME } from '@/common/constants';

import { usePopoverCreationTool } from '@/hooks';

import { cloneDeep } from 'lodash';
import { isEmpty } from '@/common/utils';

import { SHAPES } from '@/mock/shapes';

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
      return SHAPES;
    }
  },
  watch: {
    selectedToolName(val) {
      if (val === TOOL_NAME.SHAPES) this.initData();
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
      this.chosenShapes = [];
    },
    onSelectShape(data) {
      const index = this.chosenShapes.findIndex(s => s.id === data.id);

      if (index >= 0) {
        this.chosenShapes.splice(index, 1);
      } else {
        this.chosenShapes.push(data);
      }
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
      if (isEmpty(this.chosenShapes)) return;

      this.$root.$emit('printAddShapes', cloneDeep(this.chosenShapes));

      this.onClose();
    }
  }
};
