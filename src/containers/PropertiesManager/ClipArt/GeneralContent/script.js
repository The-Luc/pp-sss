import FillColor from './FillColor';
import Shadow from './Shadow';
import Opacity from './Opacity';
export default {
  components: {
    FillColor,
    Shadow,
    Opacity
  },
  data() {
    return {
      shadowItems: [
        {
          value: 'noShadow',
          label: 'No Shadow'
        },
        {
          value: 'solid',
          label: 'Solid'
        }
      ]
    };
  }
};
