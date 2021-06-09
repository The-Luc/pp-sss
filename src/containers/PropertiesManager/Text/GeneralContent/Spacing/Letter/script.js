import { mapGetters } from 'vuex';

import PpCombobox from '@/components/Combobox';
import { ICON_LOCAL } from '@/common/constants';
import { getSelectedOption, getNumberOnChanged } from '@/common/utils';

import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
    PpCombobox
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      prependedIcon: ICON_LOCAL.PREPENDED_LETTER,
      appendedIcon: ICON_LOCAL.APPENED_ICON
    };
  },
  computed: {
    ...mapGetters({
      selectedId: GETTERS.SELECTED_OBJECT_ID,
      selectedSpacing: GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: GETTERS.TRIGGER_OBJECT_CHANGE
    }),
    selectedLetterSpacing() {
      if (this.triggerChange) {
        // just for trigger the change
      }
      const selectedCharSpacing =
        this.selectedSpacing({ id: this.selectedId, prop: 'charSpacing' }) || 0;
      const selected = this.items.find(
        item => item.value === selectedCharSpacing
      );
      return getSelectedOption(selected || selectedCharSpacing, '');
    }
  },
  methods: {
    /**
     * Set value letter spacing for object text
     * @param   {Any} val value letter spacing of text (string or object)
     */
    onChange(data) {
      const result = getNumberOnChanged(data, -100, 1500, 0, this.items);
      if (result === false) {
        this.$root.$emit('printChangeTextProperties', {});
        return;
      }
      this.$root.$emit('printChangeTextProperties', {
        charSpacing: result
      });
    }
  }
};
