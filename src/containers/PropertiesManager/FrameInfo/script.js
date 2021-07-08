import PpSelect from '@/components/Selectors/Select';
import Properties from '@/components/Properties/BoxProperties';

export default {
  components: {
    PpSelect,
    Properties
  },
  data() {
    return {
      delayOpts: [
        { name: '0 s', value: 0 },
        { name: '1 s', value: 1 },
        { name: '2 s', value: 2 },
        { name: '3 s', value: 3 },
        { name: '4 s', value: 4 },
        { name: '5 s', value: 5 },
        { name: '6 s', value: 6 },
        { name: '7 s', value: 7 },
        { name: '8 s', value: 8 },
        { name: '9 s', value: 9 },
        { name: '10 s', value: 10 }
      ]
    };
  },
  methods: {
    /**
     * Fire when delay is changed
     */
    onChangeDelay(val) {
      // handle here
    }
  }
};
