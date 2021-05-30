import { mapGetters, mapMutations } from 'vuex';

import PpSelect from '@/components/Select';

import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';

export default {
  components: {
    PpSelect
  },
  data() {
    return {
      items: [
        {
          label: 'Cover Headline',
          value: 'coverHeadline',
          style: {
            fontFamily: 'Time News Roman',
            fontSize: 80,
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
    selectedItem() {
      const selectedId = this.getStyleId();

      const selected = this.items.find(item => item.value === selectedId);

      return selected;
    }
  },
  methods: {
    ...mapGetters({
      getTextStyle: PRINT_GETTERS.TEXT_STYLE,
      getStyleId: PRINT_GETTERS.TEXT_STYLE_ID
    }),
    ...mapMutations({
      setTextStyle: PRINT_MUTATES.SET_TEXT_STYLE,
      setStyleId: PRINT_MUTATES.SET_TEXT_STYLE_ID
    }),
    /**
     * Event fired when user choose an item on list
     *
     * @param {String}  value id of style
     * @param {Object}  style attribute style of style
     */
    onChange({ value, style }) {
      const styles = {};

      Object.keys(style).forEach(k => {
        const val = style[k];

        if (k === 'isBold') {
          styles['fontWeight'] = val ? 'bold' : '';

          return;
        }

        if (k === 'isItalic') {
          styles['fontStyle'] = val ? 'italic' : '';

          return;
        }

        if (k === 'isUnderline') {
          styles['underline'] = val;

          return;
        }

        if (k === 'color') {
          styles['fill'] = val;

          return;
        }

        styles[k] = val;
      });

      this.setTextStyle(style);
      this.setStyleId(value);

      this.$root.$emit('printChangeTextStyle', styles);

      this.$root.$emit('printChangeTextStyle', { styleId: value });
    }
  }
};
