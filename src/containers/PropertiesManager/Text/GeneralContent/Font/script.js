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
        { name: 'Arial', value: 'arial' },
        { name: 'Time News Roman', value: 'timeNewsRoman' },
        { name: 'Verdana', value: 'verdana' },
        { name: 'Georgia', value: 'georgia' },
        { name: 'Courier', value: 'courier' },
        { name: 'Comic Sans Ms', value: 'comic sans ms' },
        { name: 'Impact', value: 'impact' }
      ],
      fontSize: FONT_SIZE
    };
  }
};
