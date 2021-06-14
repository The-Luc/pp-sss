import FillColor from '@/components/Property/FillColor';
import Opacity from '@/components/Property/Opacity';
import Border from '@/components/Property/Border';
import Shadow from '@/components/Property/Shadow';

export default {
  components: {
    FillColor,
    Opacity,
    Border,
    Shadow
  },
  data() {
    return {
      opacityValue: 100,
      borderOptions: [
        {
          name: 'No border',
          value: 'noBorder'
        },
        {
          name: 'Line',
          value: 'line'
        }
      ],
      selectedBorder: {
        name: 'No border',
        value: 'noBorder'
      },
      shadowOptions: [
        {
          name: 'No Shadow',
          value: 'noShadow'
        },
        {
          name: 'Drop Shadow',
          value: 'dropShadow'
        }
      ],
      selectedShadow: {
        name: 'No Shadow',
        value: 'noShadow'
      }
    };
  }
};
