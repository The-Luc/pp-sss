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
      },
      opacityValue: 100
    };
  },
  methods: {
    /**
     * Change value of opacity
     * @param {Number} value value opacity
     */
    onChange(value) {
      this.opacityValue = value;
    },
    /**
     * Receive value shadow from children
     * @param   {Object}  value Value user selecte
     */
    onChangeShadow(value) {
      this.selectedShadow = value;
    }
  }
};
