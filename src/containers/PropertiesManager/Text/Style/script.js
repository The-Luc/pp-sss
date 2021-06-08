import Opacity from './Opacity';
import Border from './Border';
import Shadow from './Shadow';
import { THINKNESS_OPTIONS } from '@/common/constants';

export default {
  components: {
    Opacity,
    Border,
    Shadow
  },
  data() {
    return {
      textStyles: {
        opacity: 50
      },
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
      selectedBorder: {
        name: 'No border',
        value: 'noBorder'
      },
      selectedShadow: {
        name: 'No Shadow',
        value: 'noShadow'
      }
    };
  },
  methods: {
    /**
     * Receive value opacity from children
     * @param   {Number}  value Value user input
     */
    onChange(value) {
      this.textStyles.opacity = value;
    },
    /**
     * Receive value border from children
     * @param   {Object}  value Value user selecte
     */
    onChangeBorder(value) {
      this.selectedBorder = value;
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
