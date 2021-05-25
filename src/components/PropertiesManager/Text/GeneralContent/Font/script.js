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
        { label: 'Roboto Condensed', value: 'robotoCondensed' },
        { label: 'Arial', value: 'arial' },
        { label: 'Time News Roman', value: 'timeNewsRoman' }
      ],
      fontSize: FONT_SIZE
    };
  }
};
