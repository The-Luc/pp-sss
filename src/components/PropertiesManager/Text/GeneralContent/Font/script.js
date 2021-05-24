import PpSelect from '@/components/Select';
import FontSize from './Size';
import FontFamily from './Family';

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
      fontSize: [
        { label: '44 pt', value: 44 },
        { label: '11 pt', value: 11 }
      ]
    };
  }
};
