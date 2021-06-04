import { mapGetters } from 'vuex';

import PpSelect from '@/components/Select';

import { styleToCssStyle } from '@/common/utils';

import { GETTERS as PROP_GETTERS } from '@/store/modules/property/const';

export default {
  components: {
    PpSelect
  },
  data() {
    return {
      items: [
        {
          label: 'Default',
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
          label: 'Cover Headline',
          value: 'coverHeadline',
          style: {
            fontFamily: 'Time News Roman',
            fontSize: 72,
            isBold: true,
            isItalic: true,
            isUnderline: false,
            color: '#00FF00'
          }
        },
        {
          label: 'Page Headline',
          value: 'pageHeadline',
          style: {
            fontFamily: 'Arial',
            fontSize: 40,
            isBold: false,
            isItalic: false,
            isUnderline: true,
            color: '#FF0000'
          }
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      textProp: PROP_GETTERS.TEXT_PROPERTY
    }),
    selectedItem() {
      const selectedId = this.textProp.styleId;

      return this.items.find(item => item.value === selectedId);
    },
    selectBoxItems() {
      return this.items.map(item => {
        const { label, value, style } = item;

        return {
          label,
          value,
          style,
          cssStyle: styleToCssStyle(style)
        };
      });
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
      this.$root.$emit('printChangeTextStyle', style);

      this.$root.$emit('printChangeTextProp', { styleId: value });
    }
  }
};
