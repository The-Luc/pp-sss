import BoxProperties from '@/components/Properties/BoxProperties';
import Item from './Item';

import {
  useActionDigitalSheet,
  useGetterDigitalSheet,
  useSheet
} from '@/hooks';

export default {
  components: {
    BoxProperties,
    Item
  },
  setup() {
    const { getTransitions } = useActionDigitalSheet();
    const { currentSheet } = useSheet();
    const { triggerTransition } = useGetterDigitalSheet();

    return { getTransitions, currentSheet, triggerTransition };
  },
  data() {
    return {
      transitions: [],
      sheetId: this.currentSheet.id
    };
  },
  watch: {
    triggerTransition() {
      this.updateTransitions();
    }
  },
  mounted() {
    this.updateTransitions();
  },
  methods: {
    /**
     * Update transitions
     */
    async updateTransitions() {
      this.transitions = await this.getTransitions(this.sheetId);
    }
  }
};
