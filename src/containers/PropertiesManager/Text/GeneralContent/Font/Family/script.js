import PpSelect from '@/components/Selectors/Select';

import { useElementProperties } from '@/hooks';
import { EVENT_TYPE } from '@/common/constants/eventType';

export default {
  components: {
    PpSelect
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  setup() {
    const { getProperty } = useElementProperties();

    return {
      getProperty
    };
  },
  data() {
    const fonts = this.items.map(item => ({ name: item, value: item }));

    return {
      fonts
    };
  },
  computed: {
    selectedFont() {
      const selectedFont = this.getProperty('fontFamily') || 'Arial';

      const selected = this.items.find(
        font => font.toLowerCase() === selectedFont.toLowerCase()
      );

      return { name: selected, value: selected };
    }
  },
  methods: {
    /**
     * Change font family of text box selected
     * @param {Object} data new font family of text box
     */
    onChange(data) {
      this.$root.$emit(EVENT_TYPE.CHANGE_TEXT_PROPERTIES, {
        fontFamily: data.value
      });
    }
  }
};
