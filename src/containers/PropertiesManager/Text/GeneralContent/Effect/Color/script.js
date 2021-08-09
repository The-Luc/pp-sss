import ColorPicker from '@/containers/ColorPicker';
import { useElementProperties } from '@/hooks';
import { DEFAULT_TEXT } from '@/common/constants';
import { EVENT_TYPE } from '@/common/constants/eventType';

export default {
  components: {
    ColorPicker
  },
  setup() {
    const { getProperty } = useElementProperties();

    return {
      getProperty
    };
  },
  computed: {
    color() {
      return this.getProperty('color') || DEFAULT_TEXT.COLOR;
    }
  },
  methods: {
    /**
     * Callback function to get color and emit to text properties
     * @param {String} color Color value
     */
    onChange(color) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, { color });
    }
  }
};
