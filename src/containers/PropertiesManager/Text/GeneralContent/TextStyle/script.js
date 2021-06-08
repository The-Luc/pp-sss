import { mapGetters } from 'vuex';

import PpSelect from '@/components/Select';

import { toCssStyle } from '@/common/utils';

import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
    PpSelect
  },
  data() {
    const items = [
      {
        name: 'Default',
        value: 'default',
        style: {
          fontFamily: 'Arial',
          fontSize: 60,
          isBold: false,
          isItalic: false,
          isUnderline: false,
          color: '#000000'
        }
      },
      {
        name: 'Cover Headline',
        value: 'coverHeadline',
        style: {
          fontFamily: 'Time News Roman',
          fontSize: 90,
          isBold: true,
          isItalic: true,
          isUnderline: false,
          color: '#00FF00'
        }
      },
      {
        name: 'Page Headline',
        value: 'pageHeadline',
        style: {
          fontFamily: 'Arial',
          fontSize: 35,
          isBold: false,
          isItalic: false,
          isUnderline: true,
          color: '#FF0000'
        }
      }
    ];

    const selectBoxItems = items.map(item => {
      const { name, value, style } = item;

      return {
        name,
        value,
        style,
        cssStyle: toCssStyle(style)
      };
    });

    return {
      items,
      selectBoxItems
    };
  },
  computed: {
    ...mapGetters({
      selectedId: GETTERS.SELECTED_OBJECT_ID,
      selectedStyleId: GETTERS.PROP_OBJECT_BY_ID,
      triggerChange: GETTERS.TRIGGER_OBJECT_CHANGE
    }),
    selectedItem() {
      if (this.triggerChange) {
        // just for trigger the change
      }

      const selectedId =
        this.selectedStyleId({ id: this.selectedId, prop: 'styleId' }) ||
        'default';

      return this.items.find(item => item.value === selectedId);
    }
  },
  methods: {
    /**
     * Event fired when user choose an item on list
     *
     * @param {String}  value id of style
     * @param {Object}  style attribute style of style
     */
    onChange({ value, style }) {
      this.$root.$emit('printChangeTextProperties', style);

      this.$root.$emit('printChangeTextProperties', { styleId: value });
    }
  }
};
