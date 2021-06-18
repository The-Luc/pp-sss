import { useObject } from '@/hooks';
import FillColor from './FillColor';
import Shadow from './Shadow';
import Opacity from '@/components/Property/Opacity';
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
      }
    };
  },
  setup() {
    const { selectObjectProp, triggerClipArtChange } = useObject();
    return {
      selectObjectProp,
      triggerClipArtChange
    };
  },
  computed: {
    opacityValue() {
      if (this.triggerClipArtChange) {
        // just for trigger the change
      }

      const res = this.selectObjectProp('opacity');

      return !res ? 0 : res;
    }
  },
  methods: {
    /**
     * Receive value opacity from children
     * @param   {Number}  opacity Value user input
     */
    onChangeOpacity(opacity) {
      this.$root.$emit('printChangeClipArtProperties', { opacity });
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
