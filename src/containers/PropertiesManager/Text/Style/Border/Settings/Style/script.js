import { BORDER_STYLE } from '@/common/constants';
import Select from '@/components/Select';

export default {
  components: {
    Select
  },
  data() {
    return {
      options: BORDER_STYLE
    };
  }
};
