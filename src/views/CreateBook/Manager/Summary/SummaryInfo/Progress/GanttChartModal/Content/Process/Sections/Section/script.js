import ProcessItem from '../../ProcessItem';
import MiniProcess from '@/components/MiniProcess';
import ProcessBar from '@/components/ProcessBar';

import { PROCESS_STATUS } from '@/common/constants';

export default {
  components: {
    ProcessItem,
    MiniProcess,
    ProcessBar
  },
  props: {
    section: {
      type: Object, // name, color, status, due date, position, length
      required: true
    }
  },
  computed: {
    status() {
      const statusValue = Object.keys(PROCESS_STATUS).find(
        k => PROCESS_STATUS[k].value === this.section.status
      );

      return PROCESS_STATUS[statusValue].name;
    }
  }
};
