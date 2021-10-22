import ProcessItem from '../../ProcessItem';
import MiniProcess from '@/components/BarProcesses/MiniProcess';
import ProcessBar from '@/components/BarProcesses/ProcessBar';

import { PROCESS_STATUS_OPTIONS } from '@/common/constants';

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
      const process = PROCESS_STATUS_OPTIONS.find(
        s => s.value === this.section.status
      );

      return process?.name;
    }
  }
};
