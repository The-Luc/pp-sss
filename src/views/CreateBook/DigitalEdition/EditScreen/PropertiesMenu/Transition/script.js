import BoxProperties from '@/components/Properties/BoxProperties';
import Item from './Item';

import { useDigitalSheetAction, useSheet } from '@/hooks';

export default {
  components: {
    BoxProperties,
    Item
  },
  setup() {
    const { getTransitions } = useDigitalSheetAction();
    const { currentSheet } = useSheet();

    return { getTransitions, currentSheet };
  },
  data() {
    return {
      transitions: []
    };
  },
  async mounted() {
    this.transitions = await this.getTransitions(this.currentSheet.id);
  }
};
