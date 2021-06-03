import PpSelect from '@/components/Select';
import FontSize from './Size';
import FontFamily from './Family';
import { FONT_SIZE } from '@/mock/fontSize';

export default {
  components: {
    PpSelect,
    FontSize,
    FontFamily
  },
  data() {
    return {
      fontFamily: [
        { label: 'Arial', value: 'arial' },
        { label: 'Time News Roman', value: 'timeNewsRoman' },
        { label: 'Verdana', value: 'verdana' },
        { label: 'Georgia', value: 'georgia' },
        { label: 'Courier', value: 'courier' },
        { label: 'Comic Sans Ms', value: 'comic sans ms' },
        { label: 'Impact', value: 'impact' }
      ],
      fontSize: FONT_SIZE
    };
  }
};
