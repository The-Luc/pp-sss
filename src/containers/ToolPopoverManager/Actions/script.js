import Item from './Item';
import { ACTIONS } from '@/common/constants';

export default {
  components: {
    Item
  },
  data() {
    return {
      items: [
        { name: 'Copy Selected Item', value: ACTIONS.COPY, disabled: true },
        { name: 'Paste Copied Item', value: ACTIONS.PASTEE, disabled: true },
        { name: 'Save Layout', value: ACTIONS.SAVE_LAYOUT, disabled: false },
        { name: 'Save Style', value: ACTIONS.SAVE_STYLE, disabled: false },
        { name: 'Generate PDF', value: ACTIONS.GENERATE_PDF, disabled: false }
      ]
    };
  }
};
