import { useObject } from '@/hooks';
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
  },
  setup() {
    const { selectObjectProp, triggerShapeChange } = useObject();
    return {
      selectObjectProp,
      triggerShapeChange
    };
  },
  computed: {
    opacityValue() {
      if (this.triggerShapeChange) {
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
      this.$root.$emit('printChangeShapeProperties', { opacity });
    }
  }
};
